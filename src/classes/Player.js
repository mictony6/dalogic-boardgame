
export class Player {
  /**
   *
   * @type {Array<Move>}
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


  }

  addScore(score) {
    this.score += score;
  }


}