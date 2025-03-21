import { Chess, ChessInstance, ShortMove } from 'chess.js';

interface Timer {
  owner: number;
  opponent: number;
  increment: number;
  gameInterval: NodeJS.Timeout | null;
}

export type GameState = ReturnType<Game['getState']>;

export class Game {
  id: string;
  type: GameType = 'rapid';
  _game: ChessInstance;
  private owner: Player | null = null;
  private opponent: Player | null = null;
  private ranked: boolean;
  private tempo: Tempo;
  timer: Timer = {
    owner: 0,
    opponent: 0,
    increment: 0,
    gameInterval: null,
  };
  private playerCount: number = 0;
  hasStarted: boolean = false;
  emittingInterval: NodeJS.Timeout | null = null;
  endedByTimeout: boolean = false;

  constructor(tempo: Tempo, ranked: boolean, type: GameType, owner: Player) {
    this._game = new Chess();
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
  winner: 'w' | 'b' | 'd' | null = null;

  getState() {
    const history = this._game.history({ verbose: true });
    const winner = this._game.game_over()
      ? this._game.turn() === 'w'
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
      fen: this._game.fen(),
      hasStarted: this.hasStarted,
      gameOver: this._game.game_over() || this.endedByTimeout,
      winner: winner,
      turn: this._game.turn(),
      check: this._game.in_check(),
      checkmate: this._game.in_checkmate(),
      posOfKingInCheck: this.positionOfKingInCheck(),
      stalemate: this._game.in_stalemate(),
      insufficientMaterial: this._game.insufficient_material(),
      threefoldRepetition: this._game.in_threefold_repetition(),
      fiftyMoveRule: this._game.in_draw(),
      draw: this._game.in_draw(),
      validMoves: this._game.moves({ verbose: true, legal: true }),
      lastMove:
        history.length >= 1 &&
        this._game.history({ verbose: true })[history.length - 1],
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
    return playerToMove?.color === this._game.turn();
  }

  doesPlayerBelongToGame(playerId: string) {
    return this.owner?.id === playerId || this.opponent?.id === playerId;
  }

  positionOfKingInCheck() {
    if (this._game.in_checkmate() || this._game.in_check()) {
      const board = this._game.board();
      const turn = this._game.turn();

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

  move(move: string | ShortMove) {
    const moveResult = this._game.move(move);

    if (moveResult) {
      this.incrementTimer();
    }
    return moveResult;
  }

  whomTurnItIs() {
    if (this._game.turn() === this.owner?.color) {
      return 'owner';
    } else {
      return 'opponent';
    }
  }

  private startTimer() {
    this.timer.gameInterval = setInterval(() => {
      if (this._game.game_over()) {
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
    this.clearIntervals();
    const player = this[winner];
    this.endedByTimeout = true;
    this.winner = player!.color;
  }
}
