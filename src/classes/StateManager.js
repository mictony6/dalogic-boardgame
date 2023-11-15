export class StateManager {
  constructor(initialState) {
    this.currentState = initialState;
  }

  setPaused(paused) {
    this.currentState = paused ? 'paused' : 'playing';
  }

  get isPaused() {
    return this.currentState === 'paused';
  }

  // Add more state management methods as needed
}
