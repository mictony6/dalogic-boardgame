
export class Player {
  /**
   *
   * @type {Move[]}
   */
  validMoves = [];
  movesHistory = [];
  ownedPieces = [];
  /**
   * @type {Move[]}
   */
  captureMoves = [];
  /**
   * @type {Piece[]}
   */
  capturedPieces = [];

  /**
   * The direction in which the player move by row. A positive value means the player moves down the board.
   * @type {number}
   */
  direction = 0;
  score = 0;
  constructor(name, id, color) {
    this.name = name;
    this.id = id;
    this.color = color;
  }

  setDirectionUp() {
    this.direction = -1;
  }

  setDirectionDown() {
    this.direction = 1;
  }

  addMove(move) {
    this.movesHistory.push(move);
  }

  undoMove() {
    return this.movesHistory.pop();
  }

  numberOfActivePieces() {
    return this.ownedPieces.length
  }

  enable() {
    this.ownedPieces.forEach(piece => {
      piece.eventMode = "static";
    })
  }

  disable() {
    this.ownedPieces.forEach(piece => {
      piece.eventMode = "none";
    })
  }

  /**
   *
   * @param capturedPiece {Piece}
   */
  freePiece(capturedPiece) {
    this.ownedPieces = this.ownedPieces.filter(piece => piece !== capturedPiece);
  }


  /**
   *
   * @param move {Move}
   */
  onCapture(move) {
    const player = move.piece.player;

    this.addScore(move.piece.pieceValue);
    console.log(`Player ${player.name} captured a piece from player ${this.name}!`);
    console.log(`Player ${player.name} score is now ${player.score}`);
    this.captureMoves.push(move);
    this.capturedPieces.push(move.capturedPiece);


  }

  addScore(score) {
    this.score += score;
  }

  initPieces() {
    const targetSum = Math.floor((this.ownedPieces.length * 3) / 2)

    // Add the current pieces' values to the score
    this.ownedPieces.forEach(piece => {
      this.addScore(piece.pieceValue);
    });

    let travelled = new Set();

    // Continue adjusting the pieces until the sum reaches the target
    while (this.score !== targetSum) {
      let index = Math.floor(Math.random() * this.ownedPieces.length);

      // Skip if the index has already been travelled
      if (travelled.has(index)) continue;

      travelled.add(index);

      let value = this.ownedPieces[index].pieceValue;
      let diff = targetSum - this.score;

      // Adjust the pieceValue with clamp function
      value = Math.min(3, Math.max(value + diff, 0));

      // Update the score directly
      this.addScore(value - this.ownedPieces[index].pieceValue);

      // Update the pieceValue
      this.ownedPieces[index].pieceValue = value;
    }
  }

  reset() {
    this.validMoves.length = 0;
    this.movesHistory.length = 0;
    this.ownedPieces.forEach(piece => piece.destroy())
    this.ownedPieces.length = 0;
    this.captureMoves.length = 0;
    this.capturedPieces.length = 0;
    this.direction = 0;
    this.score = 0;
  }

}