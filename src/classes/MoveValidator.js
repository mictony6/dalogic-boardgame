
export class MoveValidator {
  /**
   *
   * @param board {GameBoard}
   */
  constructor(board) {
    this.board = board;
  }


  // /**
  //  *
  //  * @param dest {Array}
  //  * @returns {boolean}
  //  */
  // validateMove( dest) {
  //
  //   //check if dest is in bounds
  //   if (dest[0] < 0 || dest[0] >= this.board.rows || dest[1] < 0 || dest[1] >= this.board.columns) return false;
  //
  //   let destTile = this.board.getTile(dest[0], dest[1]);
  //
  //   // check if dest tile is occupied
  //   if (destTile.occupied) return false;
  //
  //
  //   return true;
  //
  // }

  /**
   *
   * @param move {Move}
   */
  validateMove(move){
    //check if dest is in bounds
    if (!move.inBounds) return false;

    // check if dest tile is occupied
    if (move.canMoveIntoTile()){
      return true;
    }

    if (this.validateCaptureMove(move)){
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
    let moveAcross = this.board.createMove(move.piece, [move.destTile.row + move.piece.player.direction, move.destTile.col + move.moveColDiff]);
    if (!moveAcross.inBounds || moveAcross.destTile.occupied) {
      return false;

    }else {

      return move.capturePossible();

    }
  }

}