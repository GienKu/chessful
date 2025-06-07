export class StockfishEngine {
  // Class properties
  private stockfish;

  constructor() {
    this.stockfish = new Worker('/stockfish-17-lite.js');
    this.initialize();
  }

  // Example method to initialize the engine
  initialize(): void {
    this.stockfish.postMessage('uci');
    this.stockfish.postMessage('isready');
    console.log('Stockfish engine initialized');
  }

  // Example method to send a command to the engine
  sendCommand(command: string): void {
    this.stockfish.postMessage(command);
  }

  evaluatePosition(fen: string, depth: number) {
    this.stop();
    this.stockfish.postMessage(`position fen ${fen}`);
    this.stockfish.postMessage(`go depth ${depth}`);
    console.log('evaluating...');
  }

  onMessage(cb: (output: ReturnType<StockfishEngine['handleOutput']>) => any) {
    this.stockfish.onmessage = (event) => {
      const out = this.handleOutput(event.data);
      if (out !== null) {
        cb(out);
      }
    };
  }

  handleOutput(output: string) {
    // Captures: 1=depth, 2=cp_score, 3=nodes, 4=pv_string
    const infoRegex =
      /^info.*?depth\s+(\d+).*?score\s+cp\s+(-?\d+).*?nodes\s+(\d+).*?pv\s+(.*)$/;
    // Captures: 1=bestmove
    // const bestmoveRegex = /^bestmove\s+(\S+)/;

    // --- Try matching the 'info' line ---
    const infoMatch = infoRegex.exec(output);

    if (infoMatch) {
      const pvString = infoMatch[4];
      const pvMoves = pvString.split(' ');
      const bestMoveAtDepth = pvMoves.length > 0 ? pvMoves[0] : null; // First move in PV

      if (bestMoveAtDepth) {
        const moveObj = {
          from: bestMoveAtDepth?.substring(0, 2),
          to: bestMoveAtDepth?.substring(2, 4),
          promotion: bestMoveAtDepth?.substring(4, 5),
        };
        return {
          type: 'info',
          depth: parseInt(infoMatch[1], 10),
          cp: parseInt(infoMatch[2], 10),
          nodes: parseInt(infoMatch[3], 10),
          pv: pvString,
          currBestMove: moveObj,
        };
      }
    }
    return null;
  }

  stop(): void {
    console.log('Engine stopped');
    this.stockfish.postMessage('stop');
  }
  quit(): void {
    console.log('Engine down');
    this.stockfish.postMessage('quit');
    this.stockfish.terminate();
  }
}
