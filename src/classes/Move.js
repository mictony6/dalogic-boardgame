export class Move{
  constructor(piece, dest ) {
    this.piece = piece;
    this.destRow = dest[0];
    this.destCol = dest[1];
    this.desTile = null;
    this.inBounds = true;

  }


}