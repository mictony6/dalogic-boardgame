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
    const [score, bestMove] = this.minimax(null, this.depth, true, manager);
    if (bestMove) {
      manager.selectedPiece = bestMove.piece;
      manager.selectedTile = bestMove.destTile;
      manager.currentMove = bestMove;
    } else {
      throw Error("No more moves");
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
    beta = Infinity,
  ) {
    if (depth === 0 || manager.isGameOver()) {
      return [manager.evaluate(), position];
    }

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      let bestMove = null;

      for (let move of manager.getAllMovesForPlayer(manager.currentPlayer)) {
        const prevPieceValue = move.piece.pieceValue;

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
        this.undoMove(move, prevPieceValue, srcTile, manager);

        maxEval = Math.max(evaluation, maxEval);
        if (maxEval === evaluation) {
          bestMove = move;
        }
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) {
          break;
        }
      }
      return [maxEval, bestMove];
    } else {
      let minEval = Infinity;
      let bestMove = null;

      let otherPlayer = manager.getOpponent(manager.currentPlayer);
      for (let move of manager.getAllMovesForPlayer(otherPlayer)) {
        const prevPieceValue = move.piece.pieceValue;

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

        this.undoMove(move, prevPieceValue, srcTile, manager);

        minEval = Math.min(evaluation, minEval);
        if (minEval === evaluation) {
          bestMove = move;
        }

        beta = Math.min(beta, evaluation);
        if (beta <= alpha) {
          break;
        }
      }
      return [minEval, bestMove];
    }
  }

  undoMove(move, prevPieceValue, srcTile, manager) {
    const piece = move.piece;
    const capturedPiece = move.capturedPiece;
    if (move.isCaptureMove) {
      piece.player.addScore(-piece.pieceValue);
      piece.pieceValue = prevPieceValue;

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
      piece.pieceValue = manager.performTileOperation(
        piece.pieceValue,
        move.capturedPiece.pieceValue,
        move.destTile.operation,
      );

      piece.player.addScore(piece.pieceValue);
    }
    piece.col = move.destTile.col;
    piece.row = move.destTile.row;

    piece.leaveCurrentTile();
    piece.occupyTile(move.destTile);
  }
}