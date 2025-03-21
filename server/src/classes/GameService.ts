import { ShortMove } from 'chess.js';
import { Game, GameState } from './Game';
import { Server, Socket } from 'socket.io';

export class GameService {
  private static instance: GameService | null = null;
  activeGames: Map<string, Game> = new Map();
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
    if (time >= 30 && increment >= 5) {
      return 'classical';
    } else if (time >= 10 && time < 30 && increment >= 2 && increment <= 15) {
      return 'rapid';
    } else if (time >= 3 && time < 10 && increment >= 1 && increment <= 3) {
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
    },
    socket: Socket,
    response: (gameId: string) => void
  ) {
    const { tempo, color, ranked } = data;
    const type = this.getGameType(tempo);

    const owner = socket.user || socket.guest;
    const rating = socket.user?.rating[type] ?? null;

    if (!owner) {
      this.emitError(socket, 'Connection error: user or guest not present');
      return;
    }

    if (!this.canCreateGame(socket)) {
      return;
    }
    const game = new Game(tempo, ranked, type, { ...owner, rating, color });
    this.activeGames.set(game.id, game);

    socket.join(game.id);
    this.emitGameListUpdate();
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
      });

      socket.join(gameId);
      this.emitGameStateUpdate(gameId);
      this.emitGameListUpdate();
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
    if (game ) {
      const moveMade = game.move(move);

      // after the game has started
      if (moveMade && game._game.history().length === 1) {
        game.start();
        game.emittingInterval = setInterval(() => {
          this.emitTimerUpdate(gameId);
        }, 1000);
      }

      // gameover
      if (game.getState().gameOver || game.endedByTimeout) {
      }

      response(moveMade ? true : false);

      this.emitGameStateUpdate(gameId);
    }
  }

  //   startGame(data: { gameId: string }, socket?: Socket) {
  //     const { gameId } = data;
  //     const game = this.activeGames.get(gameId);
  //     if (game) {
  //       game.start();
  //     }
  //   }

  //   removePlayerFromTable(data: { gameId: string }, socket?: Socket) {
  //     const { gameId, player } = data;
  //     const game = this.activeGames.get(gameId);
  //     if (game) {
  //       game.removePlayer();
  //     }
  //   }
  //   leaveGame(data: { gameId: string; player: Player }) {
  //     const { gameId, player } = data;
  //     const game = this.activeGames.get(gameId);
  //     if (game) {
  //       game.removePlayer(player);
  //     }
  //   }

  // resignGame(data: { gameId: string; player: Player }) {
  //     const { gameId, player } = data;
  //     const game = this.activeGames.get(gameId);
  //     if (game) {
  //         game.resign(player);
  //     }
  // }

  // offerDraw(data: { gameId: string; player: Player }) {
  //     const { gameId, player } = data;
  //     const game = this.activeGames.get(gameId);
  //     if (game) {
  //         game.offerDraw(player);
  //     }
  // }

  // acceptDraw(data: { gameId: string; player: Player }) {
  //     const { gameId, player } = data;
  //     const game = this.activeGames.get(gameId);
  //     if (game) {
  //         game.acceptDraw(player);
  //     }
  // }

  // declineDraw(data: { gameId: string; player: Player }) {
  //     const { gameId, player } = data;
  //     const game = this.activeGames.get(gameId);
  //     if (game) {
  //         game.declineDraw(player);
  //     }
  // }

  // addTime(data: { gameId: string; player: Player; time: number }) {
  //     const { gameId, player, time } = data;
  //     const game = this.activeGames.get(gameId);
  //     if (game) {
  //         game.addTime(player, time);
  //     }
  // }

  // rematchRequest(data: { gameId: string; player: Player }) {
  //     const { gameId, player } = data;
  //     const game = this.activeGames.get(gameId);
  //     if (game) {
  //         game.requestRematch(player);
  //     }
  // }

  // rematchAccept(data: { gameId: string; player: Player }) {
  //     const { gameId, player } = data;
  //     const game = this.activeGames.get(gameId);
  //     if (game) {
  //         game.acceptRematch(player);
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
        const state = game.getState();
        //if owner left the game then remove the game
        if (player.id === state.owner?.id) {
          this.activeGames.delete(gameId);
          // inform other player about removed game
          this.emitGameRemoved(gameId);
        } else {
          game.removePlayer(player.id);
        }

        // inform clients about that event
        socket.leave(gameId);
        this.emitGameStateUpdate(gameId);
        this.emitGameListUpdate();
        response();
        //todo check if game was ranked and has started to update ratings
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
      socket.join(gameId);
      this.emitGameStateUpdate(gameId);
      response(true);
    } else {
      response(false);
    }
  }

  // EMITTING EVENTS

  emitError(socket: Socket, message: string) {
    socket.emit('error', message);
  }

  emitGameStateUpdate(gameId: string) {
    const game = this.activeGames.get(gameId);
    if (game) {
      this.io.to(gameId).emit('gameState', game.getState());
    }
  }

  emitGameListUpdate(socket?: Socket) {
    if (socket) {
      socket.emit('gamesList', this.getGameList());
    } else {
      this.io.emit('gamesList', this.getGameList());
    }
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
    }
  }

  // UTILITY FUNCTIONS
  getGameList() {
    return Array.from(this.activeGames.entries())
      .filter(([, game]) => {
        const gameState = game.getState();
        return (
          !gameState.hasStarted && !(gameState.owner && gameState.opponent)
        );
      })
      .map(([gameId, game]) => {
        const gameState = game.getState();

        return {
          gameId: game.id,
          tempo: gameState.tempo,
          ranked: gameState.ranked,
          type: gameState.type,
          owner: {
            id: gameState.owner!.id,
            username: gameState.owner!.username,
            rating: gameState.owner!.rating,
            color: gameState.owner!.color,
          },
        };
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
  registerEventHandlers(socket: Socket) {
    socket.on('createGame', (data, response) => {
      console.log('createGame event', socket.user?.id || socket.guest?.id);
      this.createGame(data, socket, response);
    });

    socket.on('joinGame', (data, response) => {
      console.log('joinGame event', socket.user?.id || socket.guest?.id);
      this.joinGame(data, socket, response);
    });

    socket.on('makeMove', (data, response) => {
      console.log('makeMove event', socket.user?.id || socket.guest?.id);
      this.makeMove(data, socket, response);
    });
    // socket.on('startGame', (data) => {
    //   console.log('startGame event', socket.user?.id || socket.guest?.id);
    //   this.startGame(data, socket);
    // });
    // socket.on('leaveGame', (data) => {
    //   console.log('leaveGame event', socket.user?.id || socket.guest?.id);
    //   this.leaveGame(data, socket);
    // });
    // socket.on('resignGame', (data) => {
    //   console.log('resignGame event', socket.user?.id || socket.guest?.id);
    //   this.resignGame(data, socket);
    // });
    // socket.on('offerDraw', (data) => {
    //   console.log('offerDraw event', socket.user?.id || socket.guest?.id);
    //   this.offerDraw(data, socket);
    // });
    // socket.on('acceptDraw', (data) => {
    //   console.log('acceptDraw event', socket.user?.id || socket.guest?.id);
    //   this.acceptDraw(data, socket);
    // });
    // socket.on('declineDraw', (data) => {
    //   console.log('declineDraw event', socket.user?.id || socket.guest?.id);
    //   this.declineDraw(data, socket);
    // });
    // socket.on('addTime', (data) => {
    //   console.log('addTime event', socket.user?.id || socket.guest?.id);
    //   this.addTime(data, socket);
    // });
    // socket.on('rematchRequest', (data) => {
    //   console.log('rematchRequest event', socket.user?.id || socket.guest?.id);
    //   this.rematchRequest(data, socket);
    // });
    // socket.on('rematchAccept', (data) => {
    //   console.log('rematchAccept event', socket.user?.id || socket.guest?.id);
    //   this.rematchAccept(data, socket);
    // });

    socket.on('getGameState', (data, response) => {
      console.log('getGameState event', socket.user?.id || socket.guest?.id);
      this.getGameState(data, socket, response);
    });

    socket.on('removePlayerFromTable', (data, response) => {
      console.log(
        'removePlayerFromTable event',
        socket.user?.id || socket.guest?.id
      );
      this.removePlayerFromTable(data, socket, response);
    });

    socket.on('requestGamesList', () => {
      console.log(
        'requestGamesList event',
        socket.user?.id || socket.guest?.id
      );
      this.emitGameListUpdate(socket);
    });

    socket.on('reconnectToGame', (data, response) => {
      console.log('reconnectToGame event', socket.user?.id || socket.guest?.id);
      this.reconnectToGame(data, socket, response);
    });
  }
}
