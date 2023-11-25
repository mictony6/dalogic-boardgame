import Player from "./Player";

export default class RandomAI extends Player {
  /**
   *
   * @param {GameManager} manager
   * @returns
   */
  async selectAIPiece(manager) {
    // wait for game to unpause
    while (manager.stateManager.currentState === "paused") {
      new Promise((resolve) => {
        setTimeout(resolve, 100);
      }).then(() => {});
    }
    if (this.ownedPieces.length === 0) return;
    // make sure to select only piece with than can move
    let count = 1;
    const checkedPieces = new Set();

    let piece;
    while (count <= this.ownedPieces.length) {
      piece =
        this.ownedPieces[Math.floor(Math.random() * this.ownedPieces.length)];
      if (checkedPieces.has(piece)) {
        continue;
      }
      checkedPieces.add(piece);
      if (manager.getValidMoves(piece).length !== 0) {
        break;
      }
      piece = null;
      count++;
    }

    if (piece) {
      return piece;
    }
    manager.gameOver = true;
    manager.stateManager.currentState = "gameOver";

    throw Error(`Game Over. No more available piece for ${this.name}`);
  }

  async selectAITile(manager) {
    // wait for game to unpause
    while (manager.stateManager.currentState === "paused") {
      new Promise((resolve) => {
        setTimeout(resolve, 100);
      }).then(() => {});
    }
    const captureMoves = this.validMoves.filter((move) =>
      manager.moveValidator.validateCaptureMove(move),
    );
    if (captureMoves.length > 0) {
      return captureMoves[0];
    }
    const randomMove =
      this.validMoves[Math.floor(Math.random() * this.validMoves.length)];
    return randomMove;
  }

  /**
   * @param {GameManager} manager
   */
  async perform(manager) {
    // wait for game to unpause
    while (manager.stateManager.currentState === "paused") {
      new Promise((resolve) => {
        setTimeout(resolve, 100);
      }).then(() => {});
    }
    try {
      const piece = await this.selectAIPiece(manager);
      manager.selectPiece(piece);
      const randomMove = await this.selectAITile(manager);
      manager.selectTile(randomMove.destTile);
    } catch (e) {
      console.error(e);
    }
  }

  disable() {}
}
