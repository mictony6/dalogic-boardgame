import { Player } from "./Player";

export class GameEvent {
  name = "default"
  id = 0;
  constructor(name, id) {
    this.name = name;
    this.id += id;
  }
}

export class ScoreEvent extends GameEvent {
  /**
   * 
   * @param {Player} scoringPlayer 
   */
  constructor(scoringPlayer) {
    super("score", 1);
    this.scoringPlayer = scoringPlayer
  }
}

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