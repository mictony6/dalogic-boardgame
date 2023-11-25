import { GameManager } from "./GameManager";
import { Player } from "./Player";

export class RandomAI extends Player {
  constructor(name, id, color) {
    super(name, id, color);

  }
  /**
   * 
   * @param {GameManager} manager 
   * @returns 
   */
  async selectAIPiece(manager) {
    // wait for game to unpause
    while (manager.stateManager.currentState === "paused") {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (this.ownedPieces.length === 0) return;
    //make sure to select only piece with than can move
    let count = 1;
    let checkedPieces = new Set();

    let piece;
    while (count <= this.ownedPieces.length) {
      piece = this.ownedPieces[Math.floor(Math.random() * this.ownedPieces.length)];
      if (checkedPieces.has(piece)) continue;
      checkedPieces.add(piece);
      if (manager.getValidMoves(piece).length !== 0) {
        break;
      }
      piece = null
      count++;
    }

    if (piece) {
      return (piece);
    }
    throw Error("No more available piece at count: " + count)
  }

  async selectAITile(manager) {
    // wait for game to unpause
    while (manager.stateManager.currentState === "paused") {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    let captureMoves = this.validMoves.filter(move => manager.moveValidator.validateCaptureMove(move));
    if (captureMoves.length > 0) {
      return (captureMoves[0]);
    } else {
      let randomMove = this.validMoves[Math.floor(Math.random() * this.validMoves.length)];
      return (randomMove);
    }
  }

  /**
   * @param {GameManager} manager
   */
  async perform(manager) {

    // wait for game to unpause
    while (manager.stateManager.currentState === "paused") {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    try {
      const piece = await this.selectAIPiece(manager)
      manager.selectPiece(piece);
      const randomMove = await this.selectAITile(manager);
      manager.selectTile(randomMove.destTile);

    } catch (e) {
      console.error(e);
    }


  }

  disable() {
    return;
  }






}