export class MoveValidator {
  /**
   *
   * @param board {GameBoard}
   */
  constructor(board) {
    this.board = board;
  }

  /**
   *
   * @param move {Move}
   */
  validateMove(move) {
    //check if dest is in bounds
    if (!move.inBounds) return false;

    // check if dest tile is occupied
    if (move.canMoveIntoTile()) {
      return true;
    }

    if (this.validateCaptureMove(move)) {
      return true;
    }
  }

  /**
   *
   * @param move {Move}
   */
  validateCaptureMove(move) {
    // if tile across exists
    /**
     * @type {Move}
     */
    let moveAcross = this.board.createMove(move.piece, [
      move.destTile.row + move.piece.player.direction,
      move.destTile.col + move.moveColDiff,
    ]);
    if (!moveAcross.inBounds || moveAcross.destTile.occupied) {
      return false;
    } else {
      return move.capturePossible();
    }
  }
}
