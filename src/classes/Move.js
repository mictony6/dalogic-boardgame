export class Move{
  constructor(piece, dest ) {
    this.piece = piece;
    this.destRow = dest[0];
    this.destCol = dest[1];
    this.desTile = null;
    this.inBounds = true;

  }

  canCapture(){
    return this.desTile.occupied && this.desTile.piece.player !== this.piece.player;
  }

  canMove(){
    return !this.desTile.occupied;
  }


}