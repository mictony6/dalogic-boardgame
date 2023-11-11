import * as PIXI from 'pixi.js';

/**
 * Class responsible for rendering the game
 */
export class GameRenderer {
  /**
   *
   * @param app {PIXI.Application}
   */
  constructor(app) {
    this.app = app; // Pixi.js Application instance
  }

  // Add a game element to the stage for rendering
  addElement(element) {
    this.app.stage.addChild(element);
  }

  // Remove a game element from the stage
  removeElement(element) {
    this.app.stage.removeChild(element);
  }

}
