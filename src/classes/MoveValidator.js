
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
   * @param src {Array}
   * @param dest {Array}
   * @returns {boolean}
   */
  isValidMove(src, dest) {

    //check if dest is in bounds
    if (dest[0] < 0 || dest[0] >= this.board.rows || dest[1] < 0 || dest[1] >= this.board.columns) return false;

    let destTile = this.board.getTile(dest[0], dest[1]);

    // check if dest tile is occupied
    if (destTile.occupied) return false;


    return true;

  }

  /**
   *
   * @param dest {Array} [row, col]
   * @param  capturingPiece {Player}
   * @returns
   */
  isCapturingMove(dest, capturingPiece) {
    const destTile = this.board.getTile(dest[0], dest[1]);
    if (!destTile.occupied) {
      return false;
    }

    const destPiece = destTile.piece;
    return destPiece.player !== capturingPiece.player;
  }

}