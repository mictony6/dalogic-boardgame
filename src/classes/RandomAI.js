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
      }, 300 );
    });
  }

  /**
   * @param {GameManager} manager
   */
  perform(manager){
    this.selectAIPiece(manager  ).then(piece => {
      manager.selectPiece(piece);
      let randomMove = this.validMoves[Math.floor(Math.random() * this.validMoves.length)];
      if (randomMove.capturePossible()){
        manager.selectPiece(randomMove.destTile.piece);
        return;
      }
      console.log(manager.currentPlayer.name, manager.currentPlayer.numberOfActivePieces())
      manager.switchPlayerTurn();
      manager.executeMove(randomMove);
    });

  }




}