import { RandomAI } from "./RandomAI";

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
    let p1 = this.gameManager.players[0]

    if (!(p1 instanceof RandomAI)) {
      p1.owwnedPieces.forEach(piece => {
        piece.on("pointerdown", () => {
          if (!this.stateManager.isPaused) {
            this.handlePieceClick(piece);
          }
        })
        piece.eventMode = "static"
      })
    }

    let p2 = this.gameManager.players[1];

    if (!(p2 instanceof RandomAI)) {
      p2.owwnedPieces.forEach(piece => {
        piece.on("pointerdown", () => {
          if (!this.stateManager.isPaused) {
            this.handlePieceClick(piece);
          }
        })
        piece.eventMode = "static"
      })
    }
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
