import { GameManager } from "./GameManager";

export class StateManager {
  /**
   *
   * @param manager {GameManager}
   * @param initialState {string}
   */
  constructor(manager, initialState) {
    this.currentState = initialState;
    this.manager = manager;

    this.transitions = {
      playing: {
        update: manager.updatePlaying.bind(manager),
      },
      moving: {
        update: manager.animateMove.bind(manager),
      },
      capturing: {
        update: manager.updateCapturing.bind(manager),
      },
      paused: {
        update: manager.updatePaused.bind(manager),
      },
      switchingTurn: {
        update: manager.switchPlayerTurn.bind(manager),
      }
      // Add more states as needed...
    }
  }

  setPaused(paused) {
    this.currentState = paused ? 'paused' : 'playing';
  }

  get isPaused() {
    return this.currentState === 'paused';
  }

  // Add more state management methods as needed
}
