/**
 * Class representing a game event
 */
export class GameEvent {
  name = "default";
  id = 0;
  /**
   * @param {String} name
   * @param {Number} id
   */
  constructor(name, id) {
    this.name = name;
    this.id += id;
  }
}

/**
 * Class representing a score event
 */
export class ScoreEvent extends GameEvent {
  /**
   *
   * @param {Player} scoringPlayer
   */
  constructor(scoringPlayer) {
    super("score", 1);
    this.scoringPlayer = scoringPlayer;
  }
}

/**
 * Class representing when the game is ready to start
 */
export class ReadyEvent extends GameEvent {
  /**
   *
   * @param {GameManager} manager
   */
  constructor(manager) {
    super("ready", 1);
    this.manager = manager;
  }
}
