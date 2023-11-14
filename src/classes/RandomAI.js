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
        let count = 1;

        let piece = this.ownedPieces[Math.floor(Math.random() * this.ownedPieces.length)];
        while(manager.getValidMoves(piece).length === 0){

          if (count > this.ownedPieces.length){
            reject("No more available piece at count: " + count)
            break;
          }
          piece = this.ownedPieces[Math.floor(Math.random() * this.ownedPieces.length)];
          count ++;
        }
        resolve(piece);
      }, 500 );
    });
  }

  selectAITile(manager){
    return new Promise((resolve) => {
      setTimeout(() => {
        let captureMoves = this.validMoves.filter(move => manager.moveValidator.validateCaptureMove(move));
        if (captureMoves.length > 0){
          let randomMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
          resolve(randomMove);
        }else {
          let randomMove = this.validMoves[Math.floor(Math.random() * this.validMoves.length)];
          resolve(randomMove);
        }
      }, 500)
    })
  }

  /**
   * @param {GameManager} manager
   */
  async perform(manager) {
    try {
      const piece = await this.selectAIPiece(manager)
      manager.selectPiece(piece);
      const randomMove = await this.selectAITile(manager);
      manager.selectTile(randomMove.destTile);
    } catch (e) {
      console.error(e);
      console.log(manager.currentPlayer.name + " passing");
      manager.switchPlayerTurn();
    }


  }




}