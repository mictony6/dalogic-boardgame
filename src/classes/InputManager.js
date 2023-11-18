export class InputManager {
  /**
   *
   * @param gameManager {GameManager}
   * @param stateManager {StateManager}
   */
  constructor(gameManager, stateManager) {
    this.gameManager = gameManager;
    this.stateManager = stateManager;

  }

  initialize() {
    this.initializeTiles();
    this.initializePieces();
  }

  initializeTiles() {
    this.gameManager.board.tiles.flat().forEach(tile => {
      tile.on('pointerdown', () => {
        if (!this.stateManager.isPaused) {
          this.handleTileClick(tile);
        }
      });
    });
  }

  initializePieces() {
    let pieces = this.gameManager.pieces;

    pieces.forEach(piece => {
      piece.on("pointerdown", () => {
        if (!this.stateManager.isPaused) {
          this.handlePieceClick(piece);
        }
      })
    })
  }


  handlePieceClick(piece) {
    const currentState = this.stateManager.currentState;

    if (currentState === 'playing') {
      this.gameManager.selectPiece(piece);
    }
  }

  handleTileClick(tile) {
    const currentState = this.stateManager.currentState;

    if (currentState === 'playing') {
      this.gameManager.selectTile(tile);
    }

  }
}
