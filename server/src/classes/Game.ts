import { Chess, ChessInstance, ShortMove } from 'chess.js';
import { updatePlayerRanking } from '../services/updatePlayerRanking';
import { saveGame } from '../services/saveGame';
import { IGame } from '../db/models/Game';
import mongoose, { ObjectId } from 'mongoose';
import { calcNewRatings } from '../utils/calcNewRatings';

interface Timer {
  owner: number;
  opponent: number;
  increment: number;
  gameInterval: NodeJS.Timeout | null;
}

export type GameState = ReturnType<Game['getState']>;

export class Game {
  id: string;
  type: GameType;
  game: ChessInstance;
  owner: Player | null = null;
  opponent: Player | null = null;
  ranked: boolean;
  tempo: Tempo;
  timer: Timer = {
    owner: 0,
    opponent: 0,
    increment: 0,
    gameInterval: null,
  };
  emittingInterval: NodeJS.Timeout | null = null;
  playerCount: number = 0;
  hasStarted: boolean = false;
  endedByTimeout: boolean = false;
  endedByDraw: boolean = false;
  whoDisconnected: 'w' | 'b' | null = null;
  whoResigned: 'w' | 'b' | null = null;
  rematchOfferedById: string | null = null;

  constructor(tempo: Tempo, ranked: boolean, type: GameType, owner: Player) {
    this.game = new Chess();
    this.owner = owner;
    this.tempo = tempo;
    this.setTimer(tempo);
    this.type = type;
    this.ranked = ranked;
    this.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setTimer(tempo: Tempo) {
    const [time, increment] = tempo.split('+').map(Number);
    this.timer = {
      owner: time * 60,
      opponent: time * 60,
      increment,
      gameInterval: null,
    };
  }
  winner: 'w' | 'b' | null = null;
  drawOfferedById: string | null = null;

  getState() {
    const history = this.game.history({ verbose: true });
    const winner = this.game.game_over()
      ? this.game.turn() === 'w'
        ? 'b'
        : 'w'
      : null;

    return {
      gameId: this.id,
      type: this.type,
      tempo: this.tempo,
      ranked: this.ranked,
      owner: this.owner,
      opponent: this.opponent,
      fen: this.game.fen(),
      hasStarted: this.hasStarted,
      gameOver: this.isGameOver(),
      endedByTimeout: this.endedByTimeout,
      endedByDraw: this.endedByDraw,
      whoResigned: this.whoResigned,
      whoDisconnected: this.whoDisconnected,
      drawOfferedById: this.drawOfferedById,
      winner: this.winner,
      turn: this.game.turn(),
      check: this.game.in_check(),
      checkmate: this.game.in_checkmate(),
      posOfKingInCheck: this.positionOfKingInCheck(),
      stalemate: this.game.in_stalemate(),
      insufficientMaterial: this.game.insufficient_material(),
      threefoldRepetition: this.game.in_threefold_repetition(),
      fiftyMoveRule: this.game.in_draw(),
      draw: this.isDraw(),
      validMoves: this.isGameOver()
        ? []
        : this.game.moves({ verbose: true, legal: true }),
      rematchOfferedById: this.rematchOfferedById,
      lastMove:
        history.length >= 1 &&
        this.game.history({ verbose: true })[history.length - 1],
    };
  }

  removePlayer(playerId: string) {
    if (this.owner?.id === playerId) {
      this.owner = null;
      this.playerCount--;
    } else if (this.opponent?.id === playerId) {
      this.opponent = null;
      this.playerCount--;
    }
  }

  addOpponent(opponent: Player) {
    if (opponent.color !== this.owner?.color) {
      this.opponent = opponent;
      this.playerCount++;
    }
    return true;
  }

  isPlayersTurn(playerId: string) {
    const playerToMove =
      playerId === this.owner?.id ? this.owner : this.opponent;
    return playerToMove?.color === this.game.turn();
  }

  doesPlayerBelongToGame(playerId: string) {
    return this.owner?.id === playerId || this.opponent?.id === playerId;
  }

  positionOfKingInCheck() {
    if (this.game.in_checkmate() || this.game.in_check()) {
      const board = this.game.board();
      const turn = this.game.turn();

      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          const piece = board[i][j];
          if (piece?.type === 'k' && piece?.color === turn) {
            return piece;
          }
        }
      }
    }
  }

  start() {
    this.hasStarted = true;
    this.startTimer();
  }

  isGameOver() {
    return (
      this.game.game_over() ||
      this.endedByTimeout ||
      this.isDraw() ||
      !!this.whoResigned
    );
  }

  isDraw() {
    return (
      this.game.in_draw() ||
      this.game.in_stalemate() ||
      this.game.insufficient_material() ||
      this.game.in_threefold_repetition() ||
      this.endedByDraw // players accepted draw
    );
  }

  reset() {
    this.clearIntervals();
    this.game.reset();
    this.hasStarted = false;
    this.endedByTimeout = false;
    this.endedByDraw = false;
    this.winner = null;
    this.whoResigned = null;
    this.drawOfferedById = null;
    this.rematchOfferedById = null;
    this.setTimer(this.tempo);
  }

  move(move: string | ShortMove) {
    const moveResult = this.game.move(move);

    if (moveResult) {
      this.incrementTimer();
    }
    return moveResult;
  }

  handleGameEnd() {
    if (this.game.in_checkmate()) {
      this.winner = this.game.turn() === 'w' ? 'b' : 'w';
    } else if (this.isDraw()) {
      this.endedByDraw = true;
    }

    if (this.winner || this.endedByDraw) {
      this.postGameProcessing();
    }
  }

  resign(playerId: string) {
    if (!this.owner || !this.opponent) return false;

    if (this.owner?.id === playerId || this.opponent?.id === playerId) {
      const resigningPlayer =
        this.owner?.id === playerId ? this.owner : this.opponent;
      const winningPlayer =
        resigningPlayer === this.owner ? this.opponent : this.owner;

      this.whoResigned = resigningPlayer!.color;
      this.winner = winningPlayer!.color;
      this.postGameProcessing();
      return true;
    }
    return false;
  }

  endGameDueToDisconnection(discPlayerId: string) {
    this.whoDisconnected =
      this.owner?.id == discPlayerId
        ? this.owner?.color ?? null
        : this.opponent?.color ?? null;
    this.winner = this.whoDisconnected === 'w' ? 'b' : 'w';
    this.postGameProcessing();
  }

  drawOffered(playerId: string) {
    this.drawOfferedById = playerId;
  }

  drawDeclined() {
    this.drawOfferedById = null;
  }

  drawAccepted() {
    this.endedByDraw = true;
    this.postGameProcessing();
  }

  rematchOffered(playerId: string) {
    this.rematchOfferedById = playerId;
  }

  rematchDeclined() {
    this.rematchOfferedById = null;
  }

  rematchAccepted() {
    this.reset();
    this.owner!.color = this.owner!.color === 'w' ? 'b' : 'w';
    this.opponent!.color = this.opponent!.color === 'w' ? 'b' : 'w';
  }

  async updateRating() {
    if (!this.owner || !this.opponent || !this.winner || !this.ranked) return;

    try {
      const winnerPlayer =
        this.winner === this.owner.color ? this.owner : this.opponent;
      const loserPlayer =
        this.winner === this.opponent.color ? this.owner : this.opponent;

      //check if players weren't guests
      if (winnerPlayer.rating === null || loserPlayer.rating === null) return;

      const { newRating1, newRating2 } = calcNewRatings(
        winnerPlayer.rating,
        loserPlayer.rating,
        1,
        32
      );

      winnerPlayer.rating = newRating1;
      loserPlayer.rating = newRating2;

      //db update
      await updatePlayerRanking(winnerPlayer.id, newRating1, this.type);
      await updatePlayerRanking(loserPlayer.id, newRating2, this.type);
    } catch (error) {
      console.error('Failed to update ratings:', error);
    }
  }

  async saveGame() {
    try {
      //todo add other checks later
      if (!this.owner || !this.opponent) return;
      if (this.owner.rating === null || this.opponent.rating === null) return;

      const gameData = {
        whitePlayer:
          this.owner.color === 'w'
            ? new mongoose.Types.ObjectId(this.owner.id)
            : new mongoose.Types.ObjectId(this.opponent.id),
        blackPlayer:
          this.owner.color === 'b'
            ? new mongoose.Types.ObjectId(this.owner.id)
            : new mongoose.Types.ObjectId(this.opponent.id),
        whiteRating:
          this.owner.color === 'w' ? this.owner.rating! : this.opponent.rating!,
        blackRating:
          this.owner.color === 'b' ? this.owner.rating! : this.opponent.rating!,
        pgn: this.game.pgn(),
        winner: this.winner,
        gameType: this.type,
        ranked: this.ranked,
        tempo: this.tempo,
        endedByTimeout: this.endedByTimeout,
        endedByDraw: this.isDraw(),
        endedByCheckmate: this.game.in_checkmate(),
        endedByStalemate: this.game.in_stalemate(),
        endedByResignation: !!this.whoResigned || !!this.whoDisconnected,
      };

      await saveGame(gameData);
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }

  async postGameProcessing() {
    this.clearIntervals();
    await this.saveGame();
    await this.updateRating();
  }

  whomTurnItIs() {
    if (this.game.turn() === this.owner?.color) {
      return 'owner';
    } else {
      return 'opponent';
    }
  }

  isPlayerConnected(playerId: string) {
    if (this.owner?.id === playerId) {
      return this.owner.connected;
    } else if (this.opponent?.id === playerId) {
      return this.opponent.connected;
    }

    return false;
  }

  setIsPlayerConnected(playerId: string, isConnected: boolean) {
    if (this.owner?.id === playerId) {
      this.owner.connected = isConnected;
    } else if (this.opponent?.id === playerId) {
      this.opponent.connected = isConnected;
    }
  }

  private startTimer() {
    this.timer.gameInterval = setInterval(() => {
      if (this.game.game_over()) {
        this.clearIntervals();
      }

      if (this.whomTurnItIs() === 'owner') {
        this.timer.owner -= 1;
        this.timer.owner < 0 && this.endGameDueToTimeout('opponent');
      } else {
        this.timer.opponent -= 1;
        this.timer.opponent < 0 && this.endGameDueToTimeout('owner');
      }
    }, 1000);
  }

  incrementTimer() {
    // timer update should be fired only after valid move,
    // as it checks current player turn and adds time to the players
    //  that made a move in previous turn
    if (this.whomTurnItIs() === 'owner') {
      this.timer.opponent += this.timer.increment;
    } else {
      this.timer.owner += this.timer.increment;
    }
  }

  clearIntervals() {
    clearInterval(this.timer.gameInterval ?? undefined);
    clearInterval(this.emittingInterval ?? undefined);
  }

  endGameDueToTimeout(winner: 'owner' | 'opponent') {
    const player = this[winner];
    this.endedByTimeout = true;
    this.winner = player!.color;
    this.postGameProcessing();
  }
}
