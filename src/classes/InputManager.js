export class InputManager {
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
    let pieces = [...this.gameManager.players[0].ownedPieces, ...this.gameManager.players[1].ownedPieces]

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
    } else if (currentState === 'paused') {

      // Handle input for the paused state, if needed
    }
  }

  handleTileClick(tile) {
    const currentState = this.stateManager.currentState;

    if (currentState === 'playing') {
      this.gameManager.selectTile(tile);
    } else if (currentState === 'paused') {

      // Handle input for the paused state, if needed
    }

  }
}
