export type EngineOutput =
  | {
      type: 'info';
      depth: number;
      cp: number;
      nodes: number;
      pv: string;
      currBestMove: { from: string; to: string; promotion?: string };
    }
  | {
      type: 'bestmove';
      move: { from: string; to: string; promotion?: string };
    };

export class StockfishEngine {
  // Class properties
  private stockfish;
  private isReady = false;
  private isSearching = false;

  constructor() {
    this.stockfish = new Worker('/stockfish-17-lite.js');
  }

  // Example method to initialize the engine
  async initialize(options: { skillLevel?: number }): Promise<void> {
    const { skillLevel } = options;

    console.log('Stockfish engine initialization starting...');
    await this._postCommand('uci', 'uciok');

    if (skillLevel !== undefined) {
      await this.initializeAsOpponent(skillLevel);
    }

    await this._postCommand('isready', 'readyok');
    this.isReady = true;
    console.log('Stockfish engine initialized and ready.');
  }

  async initializeAsOpponent(skillLevel: number): Promise<void> {
    await this._postCommand(`setoption name Skill Level value ${skillLevel}`);
    await this._postCommand(
      'setoption name Skill Level Maximum Error value 1000'
    );
    await this._postCommand('setoption name Skill Level Probability value 1000');
    console.log(`Skill level set to ${skillLevel}`);
  }

  evaluatePosition(fen: string, depth: number) {
    if (!this.isReady) {
      console.error(
        'Engine not initialized. Please call and await initialize() first.'
      );
      return;
    }
    if (this.isSearching) {
      console.warn(
        'Engine is already searching. Call stop() first or wait for the result.'
      );
      return;
    }

    this.isSearching = true;
    // this._postCommand('ucinewgame'); // Good practice to reset state
    this._postCommand(`position fen ${fen}`);
    this._postCommand(`go depth ${depth}`);
  }

  onMessage(cb: (output: EngineOutput) => void) {
    this.stockfish.onmessage = (event: MessageEvent<string>) => {
      const output = this.handleEvaluationOutput(event.data);
      if (output !== null) {
        cb(output);
      }
    };
  }

  handleEvaluationOutput(output: string): EngineOutput | null {
    if (output.startsWith('bestmove')) {
      this.isSearching = false; // The search is done
      const moveStr = output.split(' ')[1];
      const move = {
        from: moveStr.substring(0, 2),
        to: moveStr.substring(2, 4),
        promotion: moveStr.length > 4 ? moveStr.substring(4, 5) : undefined,
      };
      return { type: 'bestmove', move };
    }

    if (output.startsWith('info')) {
      const infoData = this._parseInfo(output);
      if (infoData.pv) {
        const bestMoveAtDepth = infoData.pv.split(' ')[0];
        const moveObj = {
          from: bestMoveAtDepth.substring(0, 2),
          to: bestMoveAtDepth.substring(2, 4),
          promotion:
            bestMoveAtDepth.length > 4
              ? bestMoveAtDepth.substring(4, 5)
              : undefined,
        };
        return {
          type: 'info',
          depth: infoData.depth || 0,
          cp: infoData.score || 0,
          nodes: infoData.nodes || 0,
          pv: infoData.pv,
          currBestMove: moveObj,
        };
      }
    }

    return null;
  }

  private _postCommand(
    command: string,
    responseToWaitFor?: string
  ): Promise<void> {
    this.stockfish.postMessage(command);
    if (!responseToWaitFor) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const listener = (event: MessageEvent<string>) => {
        if (event.data.includes(responseToWaitFor)) {
          cleanup();
          resolve();
        }
      };

      const cleanup = () => {
        clearTimeout(timeoutId);
        this.stockfish.removeEventListener('message', listener);
      };

      const timeoutId = setTimeout(() => {
        cleanup();
        reject(
          new Error(
            `Timeout waiting for "${responseToWaitFor}" after sending "${command}"`
          )
        );
      }, 5000);

      this.stockfish.addEventListener('message', listener);
    });
  }

  private _parseInfo(line: string): {
    depth?: number;
    score?: number;
    nodes?: number;
    pv?: string;
  } {
    const parts = line.split(' ');
    const info: ReturnType<StockfishEngine['_parseInfo']> = {};

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === 'depth') info.depth = parseInt(parts[i + 1], 10);
      if (part === 'cp') info.score = parseInt(parts[i + 1], 10);
      if (part === 'nodes') info.nodes = parseInt(parts[i + 1], 10);
      if (part === 'pv') {
        info.pv = parts.slice(i + 1).join(' ');
        break; // pv is always the last part
      }
    }
    return info;
  }

  get ready() {
    return this.isReady;
  }
  stop(): void {
    console.log('Engine stopped');
    this.stockfish.postMessage('stop');
  }

  quit(): void {
    console.log('Engine quitting...');
    this.stockfish.postMessage('quit');
    this.stockfish.terminate();
    this.isReady = false;
  }
}
