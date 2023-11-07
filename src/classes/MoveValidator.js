
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
  // isValidMove( dest) {
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
  isValidMove(move){
    //check if dest is in bounds
    if (!move.inBounds) return false;


    if (this.isCapturingMove(move)){
      return true;
    }

    // check if dest tile is occupied
    return move.canMove();




  }

  /**
   *
   * @param move {Move}
   */
  isCapturingMove(move) {
    return move.canCapture();
  }

}