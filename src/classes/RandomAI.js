import {Player} from "./Player";

/**
 * Random AI player
 */
export class RandomAI extends Player{
  /**
   *
   * @param name {string}
   * @param id {number}
   * @param color {number}
   */
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
      if (randomMove.canCapture()){
        manager.selectPiece(randomMove.desTile.piece);
        return;
      }
      console.log(manager.currentPlayer.name, manager.currentPlayer.numberOfActivePieces())
      manager.switchPlayerTurn();
      manager.executeMove(randomMove);
    });

  }




}