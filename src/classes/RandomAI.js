import {Player} from "./Player";

export class RandomAI extends Player{
  constructor(name, id, color) {
    super(name, id, color);

  }

  selectAIPiece(manager){
    return new Promise((resolve, reject) => {
      if (this.ownedPieces.length === 0) reject("No pieces left");
      setTimeout(() => {
        //make sure to select only piece with than can move
        let piece = this.ownedPieces[Math.floor(Math.random() * this.ownedPieces.length)];
        while(manager.getValidMoves(piece).length === 0){
          piece = this.ownedPieces[Math.floor(Math.random() * this.ownedPieces.length)];
        }
        resolve(piece);
      }, 1000 );
    });
  }





  perform(manager){
    this.selectAIPiece(manager).then(piece => {
      console.log("Ai selected piece at ", [piece.row, piece.col]);
      manager.selectPiece(piece);
      this.randomMove = this.validMoves[Math.floor(Math.random() * this.validMoves.length)];
      console.log("Ai moved piece to ", this.randomMove);
      this.destTile = manager.board.getTile(this.randomMove[0], this.randomMove[1]);
      manager.switchPlayerTurn();
      manager.movePiece(this.destTile);
    });

  }




}