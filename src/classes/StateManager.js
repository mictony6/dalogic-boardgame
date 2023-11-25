import { GameManager } from "./GameManager";

export class StateManager {
  /**
   *
   * @param manager {GameManager}
   * @param initialState {string}
   */
  constructor(manager, initialState) {
    this._currentState = initialState;
    this.manager = manager;

    this.transitions = {
      playing: {
        update: manager.updatePlaying.bind(manager),
      },
      moving: {
        update: manager.updateMoving.bind(manager),
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

  set currentState(val){
    this._currentState = val;
  }

  get currentState(){
    return this._currentState;
  }

  // Add more state management methods as needed
}
