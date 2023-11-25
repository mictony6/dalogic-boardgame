import Player from "./Player";

export default class MiniMaxAI extends Player {
  selectAIPiece(manager) {}

  selectAITile(manager) {}

  perform(manager) {}

  /**
   *
   * @param position {GameManager}
   * @param depth
   * @param maximizingPlayer
   * @return {*}
   */
  minimax(position, depth, maximizingPlayer) {
    if (depth === 0 || position.isTerminal()) {
      return position.evaluate();
    }
  }
}
