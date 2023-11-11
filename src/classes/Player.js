/**
 * Base class for a player.
 */
export class Player{
  /**
    *
   * @param name {string}
   * @param id {number}
   * @param color {number}
   */
  constructor(name, id, color) {
    this.name = name;
    this.id = id;
    this.color =color;
    /**
     *
     * @type {Array<Move>}
     */
    this.validMoves = [];
    this.movesHistory = [];
    this.ownedPieces = [];



  }

  addMove(move){
    this.movesHistory.push(move);
  }

  undoMove(){
    return this.movesHistory.pop();
  }

  numberOfActivePieces(){
    return this.ownedPieces.length
  }



}