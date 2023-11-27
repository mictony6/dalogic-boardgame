import Player from "./Player";
import { Move } from "./Move";

export default class MiniMaxAI extends Player {
  constructor(name, id, color, depth) {
    super(name, id, color);
    this.depth = depth;
  }
  selectAIPiece(manager) {}

  selectAITile(manager) {}

  perform(manager) {
    this.iterations = 0;
    const start = performance.now();
    const [score, bestMove] = this.minimax(null, this.depth, true, manager);
    const end = performance.now();
    console.log(`${this.name} did Iterations: ${this.iterations}`);
    console.log(`Time taken by minimax: ${end - start} milliseconds`);
  
    if (bestMove) {
      manager.selectedPiece = bestMove.piece;
      manager.selectedTile = bestMove.destTile;
      manager.currentMove = bestMove;
    } else {
      manager.stateManager.currentState = "switchingTurn"
    }
  }

  /**
   *
   * @param position {Move}
   * @param depth {Number}
   * @param maximizingPlayer {Boolean}
   * @param manager {GameManager}
   * @param alpha {Number}
   * @param beta {Number}
   * @return {[Number, Move]}
   */
  minimax(
    position,
    depth,
    maximizingPlayer,
    manager,
    alpha = -Infinity,
    beta = Infinity
  ) {
    this.iterations += 1;
    if (depth === 0 || manager.isGameOver()) {
      return [manager.evaluate(), position];
    }

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      let bestMove = null;
      const moves = manager.getAllMovesForPlayer(this);
      for (let move of moves ) {


        const piece = move.piece;
        const srcTile = piece.tile;
        this.makeMove(move, manager);

        let evaluation = this.minimax(
          move,
          depth - 1,
          false,
          manager,
          alpha,
          beta,
        )[0];
        // undo move
        this.undoMove(move, srcTile, manager);

        maxEval = Math.max(maxEval, evaluation)
        
        if (maxEval === evaluation) {
          bestMove = move;
        }
        alpha = Math.max(alpha, evaluation);
        if (beta < alpha) {
          console.log(`beta: ${beta} <= alpha: ${alpha}\n`);
          return [maxEval, bestMove];
      
        }
        


      }
      return [maxEval, bestMove];
    } else {
      let minEval = Infinity;
      let bestMove = null;

      let otherPlayer = manager.getOpponent(this);
      const moves = manager.getAllMovesForPlayer(otherPlayer);

      for (let move of moves) {
        const piece = move.piece;
        const srcTile = piece.tile;

        this.makeMove(move, manager);

        let evaluation = this.minimax(
          move,
          depth - 1,
          true,
          manager,
          alpha,
          beta,
        )[0];

        this.undoMove(move, srcTile, manager);

        minEval = Math.min(minEval, evaluation);
        
        if (minEval === evaluation) {
          bestMove = move;
        }

        beta = Math.min(beta, evaluation);
        if (beta < alpha) {
          return [minEval, bestMove];
          
        }
        


      }
      return [minEval, bestMove];
    }
  }

  undoMove(move, srcTile, manager) {
    const piece = move.piece;
    const capturedPiece = move.capturedPiece;
    if (move.isCaptureMove) {
      piece.player.addScore(-move.points);

      capturedPiece.player.ownedPieces.push(capturedPiece);
      manager.board.pieces.push(capturedPiece);
      manager.board.addChild(capturedPiece);
    }

    // undo move
    piece.col = srcTile.col;
    piece.row = srcTile.row;

    piece.leaveCurrentTile();
    piece.occupyTile(srcTile);
  }

  makeMove(move, manager) {
    const piece = move.piece;

    // if capture move
    if (move.isCaptureMove) {
      move.capturedPiece = move.destTile.piece;

      // Get the destination tile for the capturing piece
      move.destTile = manager.board.getTile(
        move.destTile.row + piece.player.direction,
        move.destTile.col + move.moveColDiff,
      );

      move.capturedPiece.player.freePiece(move.capturedPiece, manager.board);
      move.points = manager.performTileOperation(
        piece.pieceValue,
        move.capturedPiece.pieceValue,
        move.destTile.operation,
      );

      piece.player.addScore(move.points);
    }
    piece.col = move.destTile.col;
    piece.row = move.destTile.row;

    piece.leaveCurrentTile();
    manager.deselectPiece();
    piece.occupyTile(move.destTile);
  }
}
