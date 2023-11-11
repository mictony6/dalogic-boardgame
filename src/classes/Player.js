export class Player{
  constructor(name, id, color) {
    this.name = name;
    this.id = id;
    this.color =color;
    /**
     *
     * @type {Array<Move>}
     */
    this.validMoves = [];
    this.movesHistory = [];
    this.ownedPieces = [];

    /**
     * The direction in which the player move by row. A positive value means the player moves down the board.
     * @type {number}
     */
    this.direction = 0;



  }

  setDirectionUp(){
    this.direction = -1;
  }

  setDirectionDown(){
    this.direction = 1;
  }

  addMove(move){
    this.movesHistory.push(move);
  }

  undoMove(){
    return this.movesHistory.pop();
  }

  numberOfActivePieces(){
    return this.ownedPieces.length
  }

  enable(){
    this.ownedPieces.forEach(piece => {
      piece.eventMode = "static";
    })
  }

  disable(){
    this.ownedPieces.forEach(piece => {
      piece.eventMode = "none";
    })
  }

  /**
   *
   * @param capturedPiece {Piece}
   */
  freePiece(capturedPiece){
    this.ownedPieces = this.ownedPieces.filter(piece => piece !== capturedPiece);
  }




}