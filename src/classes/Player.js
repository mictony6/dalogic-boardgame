export class Player{
  constructor(name, id, color) {
    this.name = name;
    this.id = id;
    this.color =color;
    this.validMoves = [];
    this.movesHistory = [];
    this.ownedPieces = [];



  }

  addMove(move){
    this.movesHistory.push(move);
  }

  undoMove(){
    return this.movesHistory.pop();
  }



}