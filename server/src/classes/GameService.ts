import { Move, ShortMove } from 'chess.js';
import { Game, GameState } from './Game';
import { Server, Socket } from 'socket.io';
import { map } from 'valibot';
import { response } from 'express';
import { disconnect } from 'mongoose';

interface Player {
  id: string;
  username: string;
  socketId: string;
}
export class GameService {
  private static instance: GameService | null = null;
  activeGames: Map<string, Game> = new Map();
  activePlayers: Map<string, Player> = new Map();
  abortGameControllers: Map<string, NodeJS.Timeout> = new Map();
  io: Server;

  private constructor(io: Server) {
    this.io = io;
  }
  // singleton approach
  static getInstance(io: Server): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService(io);
    }
    return GameService.instance;
  }

  private getGameType(tempo: Tempo) {
    const [time, increment] = tempo.split('+').map(Number);
    if (time >= 30 && increment >= 0) {
      return 'classical';
    } else if (time >= 10 && time < 30 && increment >= 0) {
      return 'rapid';
    } else if (time >= 3 && time < 10 && increment >= 0) {
      return 'blitz';
    } else {
      return 'bullet';
    }
  }

  // INCOMING EVENTS

  createGame(
    data: {
      tempo: Tempo;
      color: 'w' | 'b';
      ranked: boolean;
      invitedPlayerId?: string;
    },
    socket: Socket,
    response: (gameId: string) => void
  ) {
    const { tempo, color, ranked, invitedPlayerId } = data;

    if (invitedPlayerId && !this.activePlayers.has(invitedPlayerId)) {
      this.emitError(socket, 'Player is not online');
      return;
    }

    const type = this.getGameType(tempo);
    const owner = socket.user || socket.guest;
    const rating = socket.user?.rating[type] ?? null;

    if (!owner) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }

    if (!this.canCreateGame(socket)) {
      this.emitError(socket, 'You cannot create game');
      return;
    }
    const game = new Game(
      tempo,
      ranked,
      type,
      {
        id: owner.id,
        username: owner.username,
        rating,
        color,
        connected: true,
      },
      !!invitedPlayerId
    );

    this.activeGames.set(game.id, game);
    socket.join(game.id);

    if (game.privateGame) {
      this.emitInvitation(game, socket, invitedPlayerId!);
    } else {
      this.emitGameListUpdate();
    }
    response(game.id);
  }

  joinGame(
    data: { gameId: string },
    socket: Socket,
    response: (gameId: string) => void
  ) {
    const { gameId } = data;
    const game = this.activeGames.get(gameId);

    if (game && this.canJoinGame(socket)) {
      const gameState = game.getState();
      if (gameState.opponent) {
        this.emitError(socket, 'Game already has an opponent');
        return;
      }

      const opponent = socket.user || socket.guest;
      if (!opponent) {
        this.emitError(socket, 'Connection error: user or guest not present');
        return;
      }

      if (opponent.id === gameState.owner?.id) {
        this.emitError(socket, 'Cannot join to your game as opponent');
        return;
      }

      const rating = socket.user?.rating[gameState.type] ?? null;
      const color = gameState.owner?.color === 'w' ? 'b' : 'w';

      game.addOpponent({
        id: opponent?.id,
        username: opponent?.username,
        color,
        rating,
        connected: true,
      });

      socket.join(gameId);
      this.emitGameStateUpdate(gameId);

      if (!game.privateGame) {
        this.emitGameListUpdate();
      }
      response(gameId);
    }
  }

  getGameState(
    data: { gameId: string },
    socket: Socket,
    response: (isSuccess: boolean) => void
  ) {
    const { gameId } = data;

    const player = socket.user || socket.guest;
    if (!player) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }

    const game = this.activeGames.get(gameId);

    if (
      game &&
      game.doesPlayerBelongToGame(player.id) &&
      socket.rooms.has(gameId)
    ) {
      this.emitGameStateUpdate(gameId);
      response(true);
    } else {
      response(false);
    }
  }

  makeMove(
    data: { gameId: string; move: ShortMove },
    socket: Socket,
    response: (wasValid: boolean) => void
  ) {
    const { gameId, move } = data;

    const player = socket.user || socket.guest;
    if (!player) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }

    const game = this.activeGames.get(gameId);
    if (game) {
      const moveMade = game.move(move);

      // after the game has started
      if (moveMade && game.game.history().length === 1) {
        game.start();
        game.emittingInterval = setInterval(() => {
          this.emitTimerUpdate(gameId);
        }, 1000);
      }

      // gameover
      if (game.isGameOver()) {
        game.handleGameEnd();
      }

      moveMade && this.emitMoveMade(gameId, moveMade);
      this.emitGameStateUpdate(gameId);
    }
  }

  resign(data: { gameId: string }, socket: Socket) {
    const player = socket.user || socket.guest;
    if (!player) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }

    const { gameId } = data;
    const game = this.activeGames.get(gameId);

    if (game && game.doesPlayerBelongToGame(player.id)) {
      if (game.resign(player.id)) {
        this.emitGameStateUpdate(gameId);
      } else {
        this.emitError(socket, 'You cannot resign from this game');
      }
    }
  }

  offerDraw(data: { gameId: string }, socket: Socket) {
    const player = socket.user || socket.guest;
    if (!player) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }

    const { gameId } = data;
    const game = this.activeGames.get(gameId);
    if (game && !game.isGameOver() && game.doesPlayerBelongToGame(player.id)) {
      //inform clients about pending draw request
      game.drawOffered(player.id);
      this.emitGameStateUpdate(gameId);
    }
  }

  offerDrawResponse(
    data: { gameId: string; isAccepted: boolean },
    socket: Socket
  ) {
    const player = socket.user || socket.guest;
    if (!player) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }

    const { gameId, isAccepted } = data;
    const game = this.activeGames.get(gameId);
    if (game && !game.isGameOver() && game.doesPlayerBelongToGame(player.id)) {
      if (isAccepted) {
        game.drawAccepted();
      } else {
        game.drawDeclined();
      }
      this.emitGameStateUpdate(gameId);
    }
  }

  offerRematch(data: { gameId: string }, socket: Socket) {
    const player = socket.user || socket.guest;
    if (!player) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }

    const { gameId } = data;
    const game = this.activeGames.get(gameId);
    if (game && game.isGameOver() && game.doesPlayerBelongToGame(player.id)) {
      //inform clients about pending draw request
      game.rematchOffered(player.id);
      this.emitGameStateUpdate(gameId);
    }
  }

  offerRematchResponse(
    data: { gameId: string; isAccepted: boolean },
    socket: Socket
  ) {
    const player = socket.user || socket.guest;
    if (!player) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }

    const { gameId, isAccepted } = data;
    const game = this.activeGames.get(gameId);
    if (game && game.isGameOver() && game.doesPlayerBelongToGame(player.id)) {
      if (isAccepted) {
        game.rematchAccepted();
      } else {
        game.rematchDeclined();
      }
      this.emitGameStateUpdate(gameId);
    }
  }

  invitationDeclined(
    data: {
      invitationSenderId: string;
      gameId: string;
      isAccepted: boolean;
    },
    socket: Socket
  ) {
    this.activeGames.delete(data.gameId);
    this.io.to(data.gameId).emit('invitationDeclined');
  }

  // addTime(data: { gameId: string; player: Player; time: number }) {
  //     const { gameId, player, time } = data;
  //     const game = this.activeGames.get(gameId);
  //     if (game) {
  //         game.addTime(player, time);
  //     }
  // }

  removePlayerFromTable(
    data: { gameId: string },
    socket: Socket,
    response: () => void
  ) {
    const { gameId } = data;

    if (gameId) {
      const player = socket.user || socket.guest;
      if (!player) {
        this.emitError(socket, 'Connection error: user or guest not present');
        return;
      }

      const game = this.activeGames.get(gameId);

      if (game && game.doesPlayerBelongToGame(player.id)) {
        //if owner left the game then remove the game
        if (player.id === game.owner?.id || game.privateGame) {
          game.clearIntervals();
          this.activeGames.delete(gameId);
          // inform about removed game
          this.emitGameRemoved(gameId);
        } else {
          //if opponent left game then reset the game and remove player
          game.removePlayer(player.id);
          game.reset();
        }

        // inform clients about that event
        socket.leave(gameId);
        this.emitGameStateUpdate(gameId);
        this.emitGameListUpdate();
        response();
      } else {
        this.emitError(socket, "Game doesn't exist");
      }
    }
  }

  reconnectToGame(
    data: { gameId: string },
    socket: Socket,
    response: (isSuccess: boolean) => void
  ) {
    const { gameId } = data;
    const player = socket.user || socket.guest;

    if (!player) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }

    const game = this.activeGames.get(gameId);
    if (game && game.doesPlayerBelongToGame(player.id)) {
      console.log('clear game abort timeout ', `${gameId}-${player.id}`);

      socket.join(gameId);
      clearTimeout(this.abortGameControllers.get(`${gameId}-${player.id}`));
      game.setIsPlayerConnected(player.id, true);
      
      this.emitGameStateUpdate(gameId);
      response(true);
    } else {
      response(false);
    }
  }

  disconnect(socket: Socket) {
    const player = socket.user || socket.guest;

    if (!player) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }

    const playerGames = this.getPlayerGames(player.id, true) as Game[];

    playerGames.forEach((game) => {
      game.setIsPlayerConnected(player.id, false);
      socket.leave(game.id);

      this.emitGameStateUpdate(game.id);

      this.abortGameControllers.set(
        `${game.id}-${player.id}`,
        setTimeout(() => {

          if (this.activeGames.has(game.id) && game.hasStarted) {
            game.endGameDueToDisconnection(player.id);
            console.log(
              'game ended due to disconection by: ' + player.username
            );
          }

          this.emitGameStateUpdate(game.id);
          this.emitGameRemoved(game.id);
          this.activeGames.delete(game.id);
        }, 15000)
      );
    });
  }

  // EMITTING EVENTS

  emitMoveMade(gameId: string, move: Move) {
    this.io.to(gameId).emit('moveMade', move);
  }

  emitError(socket: Socket, message: string) {
    socket.emit('error', message);
  }

  emitInvitation(game: Game, socket: Socket, invitedPlayerId: string) {
    const player = this.activePlayers.get(invitedPlayerId);
    if (!player) {
      this.emitError(socket, 'Player is not online');
      return;
    }
    if (player?.socketId) {
      this.io.to(player.socketId).emit('invitation', {
        gameId: game.id,
        tempo: game.tempo,
        type: game.type,
        color: game.owner?.color === 'w' ? 'b' : 'w',
        invitedBy: { id: game.owner?.id, username: game.owner?.username },
        ranked: game.ranked,
      });
    }
  }

  emitGameStateUpdate(gameId: string) {
    const game = this.activeGames.get(gameId);
    if (game) {
      this.io.to(gameId).emit('gameState', game.getState());
      this.io.to(gameId).emit('timerUpdate', {
        owner: game.timer.owner,
        opponent: game.timer.opponent,
      });
    }
  }

  emitGameListUpdate(socket?: Socket) {
    if (socket) {
      socket.emit('gamesList', this.getGameList());
    } else {
      this.io.emit('gamesList', this.getGameList());
    }
  }

  emitPlayerGames(socket: Socket) {
    const user = socket.user || socket.guest;
    if (!user) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }
    socket.emit('playerGames', this.getPlayerGames(user.id));
  }

  emitGameRemoved(gameId: string) {
    this.io.to(gameId).emit('gameRemoved');
  }

  emitTimerUpdate(gameId: string) {
    const game = this.activeGames.get(gameId);
    if (game) {
      this.io.to(gameId).emit('timerUpdate', {
        owner: game.timer.owner,
        opponent: game.timer.opponent,
      });

      if (game.timer.owner <= 0) {
        game.endGameDueToTimeout('opponent');
        this.emitGameStateUpdate(gameId);
      } else if (game.timer.opponent <= 0) {
        game.endGameDueToTimeout('owner');
        this.emitGameStateUpdate(gameId);
      }
    }
  }

  // UTILITY FUNCTIONS
  getGameList() {
    return Array.from(this.activeGames.entries())
      .filter(([, game]) => {
        const gameState = game.getState();
        return (
          !game.privateGame &&
          !gameState.hasStarted &&
          !(gameState.owner && gameState.opponent)
        );
      })
      .map(([gameId, game]) => {
        const gameState = game.getState();

        return {
          gameId: game.id,
          tempo: gameState.tempo,
          ranked: gameState.ranked,
          type: gameState.type,
          owner: gameState.owner,
          opponent: gameState.opponent,
        };
      });
  }

  getPlayerGames(playerId: string, verbose: boolean = false) {
    return Array.from(this.activeGames.entries())
      .filter(([, game]) => game.doesPlayerBelongToGame(playerId))
      .map(([gameId, game]) => {
        if (verbose) {
          return game;
        } else {
          const gameState = game.getState();
          return {
            gameId: game.id,
            tempo: gameState.tempo,
            ranked: gameState.ranked,
            type: gameState.type,
            owner: gameState.owner,
            opponent: gameState.opponent,
          };
        }
      });
  }

  canCreateGame(socket: Socket) {
    const player = socket.user || socket.guest;

    if (!player) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return false;
    }

    if (this.activeGames.size >= 100) {
      this.emitError(socket, 'Too many games on server, try again later');
      return false;
    }

    const canCreate = !Array.from(this.activeGames.entries()).some(
      ([, game]) => {
        return game.doesPlayerBelongToGame(player.id);
      }
    );
    if (!canCreate) {
      this.emitError(
        socket,
        'You cannot join to more than one game, first leave the current one'
      );
    }

    return canCreate;
  }

  canJoinGame(socket: Socket) {
    //check if user is already in any active game
    const player = socket.user || socket.guest;
    if (!player) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return false;
    }
    const canJoin = !Array.from(this.activeGames.entries()).some(([, game]) => {
      return game.doesPlayerBelongToGame(player.id);
    });

    if (!canJoin) {
      this.emitError(
        socket,
        'You cannot join to more than one game, first leave the current one'
      );
    }

    return canJoin;
  }

  registerPlayer(socket: Socket) {
    const player = socket.user || socket.guest;
    if (!player) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }

    this.activePlayers.set(player.id, {
      id: player.id,
      username: player.username,
      socketId: socket.id,
    });
  }

  unregisterPlayer(socket: Socket) {
    const player = socket.user || socket.guest;
    if (!player) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }
    this.activePlayers.delete(player.id);
  }

  registerEventHandlers(socket: Socket) {
    const listeners = {
      createGame: (
        data: { tempo: Tempo; color: 'w' | 'b'; ranked: boolean },
        response: (gameId: string) => void
      ) => {
        console.log('createGame event by', socket.user?.id || socket.guest?.id);
        this.createGame(data, socket, response);
      },

      joinGame: (
        data: { gameId: string },
        response: (gameId: string) => void
      ) => {
        console.log('joinGame event by', socket.user?.id || socket.guest?.id);
        this.joinGame(data, socket, response);
      },

      invitationResponse: (
        data: {
          invitationSenderId: string;
          gameId: string;
          isAccepted: boolean;
        },
        response: (gameId: string) => void
      ) => {
        console.log(
          'invitationResponse event by',
          socket.user?.id || socket.guest?.id
        );
        if (!data.isAccepted) {
          this.invitationDeclined(data, socket);
        } else {
          this.joinGame(data, socket, response);
        }
      },

      makeMove: (
        data: { gameId: string; move: ShortMove },
        response: (wasValid: boolean) => void
      ) => {
        console.log('makeMove event by', socket.user?.id || socket.guest?.id);
        this.makeMove(data, socket, response);
      },

      offerDraw: (data: { gameId: string; move: ShortMove }) => {
        console.log('offerDraw event by', socket.user?.id || socket.guest?.id);
        this.offerDraw(data, socket);
      },

      offerDrawResponse: (data: { gameId: string; isAccepted: boolean }) => {
        console.log(
          'drawOfferResponse event by',
          socket.user?.id || socket.guest?.id
        );
        this.offerDrawResponse(data, socket);
      },

      offerRematch: (data: { gameId: string; move: ShortMove }) => {
        console.log(
          'offerRematch event by',
          socket.user?.id || socket.guest?.id
        );
        this.offerRematch(data, socket);
      },

      offerRematchResponse: (data: { gameId: string; isAccepted: boolean }) => {
        console.log(
          'drawRematchResponse event by',
          socket.user?.id || socket.guest?.id
        );
        this.offerRematchResponse(data, socket);
      },

      resign: (data: { gameId: string }) => {
        console.log('resign event by', socket.user?.id || socket.guest?.id);
        this.resign(data, socket);
      },

      getGameState: (
        data: { gameId: string },
        response: (isSuccess: boolean) => void
      ) => {
        console.log(
          'getGameState event by',
          socket.user?.id || socket.guest?.id
        );
        this.getGameState(data, socket, response);
      },

      removePlayerFromTable: (
        data: { gameId: string },
        response: () => void
      ) => {
        console.log(
          'removePlayerFromTable event by',
          socket.user?.id || socket.guest?.id
        );
        this.removePlayerFromTable(data, socket, response);
      },

      requestGamesList: () => {
        console.log(
          'requestGamesList event by',
          socket.user?.id || socket.guest?.id
        );
        this.emitGameListUpdate(socket);
      },

      getPlayerGames: () => {
        console.log(
          'getPlayerGames event by',
          socket.user?.id || socket.guest?.id
        );
        this.emitPlayerGames(socket);
      },

      reconnectToGame: (
        data: { gameId: string },
        response: (isSuccess: boolean) => void
      ) => {
        console.log(
          'reconnectToGame event by',
          socket.user?.id || socket.guest?.id
        );
        this.reconnectToGame(data, socket, response);
      },
      disconnect: () => {
        console.log('disconnect event by', socket.user?.id || socket.guest?.id);
        this.unregisterPlayer(socket);
        this.disconnect(socket);
      },
    };

    this.registerPlayer(socket);

    for (const [event, listener] of Object.entries(listeners)) {
      socket.on(event, listener);
    }

    return () => {
      for (const [event, listener] of Object.entries(listeners)) {
        socket.off(event, listener);
      }
    };
  }
}
