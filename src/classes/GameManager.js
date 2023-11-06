import { GameBoard } from "./GameBoard";
import { Piece } from "./Piece";
import { Player } from "./Player";
import { MoveValidator } from "./MoveValidator";
import {RandomAI} from "./RandomAI";

function createEnum(values) {
  const enumObject = {};
  let count = 0;
  for (const val of values) {
    enumObject[val] = count++;
  }
  return Object.freeze(enumObject);
}
const GameMode = createEnum(['PlayerVsPlayer', 'PlayerVsAI', 'AIVsAI']);


export class GameManager {
  constructor(app, renderer) {
    this.app = app;
    this.renderer = renderer;
    this.board = new GameBoard(8, 8, 64, this.app)
    this.pieces = []
    this.players = []
    this.selectedPiece = null;
    this.selectedTile = null;
    this.currentPlayer = null;
    this.moveValidator = new MoveValidator(this.board);
    this.gameMode = GameMode.AIVsAI;

  }

  start() {
    // Initialize your game here
    this.loadGame();
    // run the first move if currentPlayer is AI
    if (this.currentPlayer instanceof RandomAI){
      this.currentPlayer.perform(this);
    }
    this.app.ticker.add(this.updateAll.bind(this));
  }

  loadTiles() {
    this.board.tiles.flat().forEach(tile => {
      tile.on('pointerdown', () => {
        if (!this.selectedPiece) return;

        // if (this.currentPlayer.validMoves.find(validMove => validMove.desTile === tile)) {
        //   this.switchPlayerTurn();
        //   this.movePiece(tile);
        // } else {
        //   this.deselectPiece();
        // }
        let isInValidMoves = false;


        for (let i = 0; i < this.currentPlayer.validMoves.length; i++){
          if (this.currentPlayer.validMoves[i].desTile === tile){
            this.switchPlayerTurn();
            this.movePiece(this.currentPlayer.validMoves[i]);
            isInValidMoves = true;
            break;
          }
        }
        if (!isInValidMoves) {
          this.deselectPiece();
        }



      });
      tile.eventMode = "static";
    });
  }

  loadPiecesForPlayer(player, startingRow) {
    for (let col = 0; col < this.board.columns; col++) {
      const tile = this.board.getTile(startingRow, col);
      if (tile.isBlack) continue;
      let piece = new Piece(startingRow, col, 64, this.app);
      piece.assignPlayer(player);
      piece.occupyTile(tile);
      this.pieces.push(piece);
      this.renderer.addElement(piece);

      piece.on('pointerdown', () => {
        this.selectPiece(piece);
      });
      piece.eventMode = "static";

      player.ownedPieces.push(piece);
    }
  }

  loadGame() {
    let player1 = null;
    let player2 = null;
    if (this.gameMode === GameMode.PlayerVsPlayer) {
      player1 = new Player("Player 1", 1, 0xff0000);
      player2 = new Player("Player 2", 2, 0x0000ff);

    }else if (this.gameMode === GameMode.PlayerVsAI){
      player1 = new Player("Player 1", 1, 0xff0000);
      player2 = new RandomAI("Player 2", 2, 0x0000ff);
    } else if (this.gameMode === GameMode.AIVsAI){
      player1 = new RandomAI("Player 1", 1, 0xff0000);
      player2 = new RandomAI("Player 2", 2, 0x0000ff);

    }

    this.players.push(player1);
    this.players.push(player2);
    this.currentPlayer = player1;

    this.renderer.addElement(this.board);

    this.loadPiecesForPlayer(player1, 7);
    this.loadPiecesForPlayer(player1, 6);
    this.loadPiecesForPlayer(player2, 0);
    this.loadPiecesForPlayer(player2, 1);
    this.loadTiles();
  }

  /**
   * Selects a piece and highlights its valid moves
   * @param piece { Piece}
   */
  selectPiece(piece) {
    if (piece.player !== this.currentPlayer) {
      console.log("not yours")
      this.resetTileTints();
      return;
    }

    this.deselectPiece(); // Deselect any previously selected piece and clear its valid moves

    this.selectedPiece = piece;
    this.showValidMoves();
  }


  deselectPiece() {
    if (this.selectedPiece) {
      this.selectedPiece = null;
      this.currentPlayer.validMoves = [];
      this.resetTileTints();
    }
  }

  resetTileTints() {
    this.board.tiles.flat().forEach(tile => {
      tile.tint = tile.isBlack ? 0x000000 : 0xffffff;
    });
  }



  update(delta) {}


  updateAll(delta) {
    this.update(delta);
  }



  getValidMoves(piece){
    const moves = this.getAllMoves(piece);
    return moves.filter(move => this.moveValidator.isValidMove( move))
  }

  /**
   * Returns all possible diagonal moves for a piece. Does not check if the move is valid.
   * @param piece {Piece}
   * @returns {Array<Move>}
   */
  getAllMoves(piece){
    return [
      this.board.createMove(piece, [piece.row + 1, piece.col + 1]),
      this.board.createMove(piece, [piece.row + 1, piece.col - 1]),
      this.board.createMove(piece, [piece.row - 1, piece.col + 1]),
      this.board.createMove(piece, [piece.row - 1, piece.col - 1])
    ]


  }

  /**
   * Highlights all valid moves for a piece
   */
  showValidMoves() {
    let piece = this.selectedPiece;

    // Reset the tint for all tiles
    this.resetTileTints();

    this.currentPlayer.validMoves = this.getValidMoves(piece);
    this.currentPlayer.validMoves.forEach(move => {
      let tile = move.desTile;
      tile.tint = 0x00ff00; // Apply tint to valid tiles
    });

  }


  /**
   * Moves a piece
   * @param move {Move}
   */
  movePiece(move) {

    const tile = move.desTile;

    const destination = {
      x: tile.x + this.board.x,
      y: tile.y + this.board.y,
    };

    const startingPosition = {
      x: this.selectedPiece.x,
      y: this.selectedPiece.y,
    };

    const animationDuration = 250; // Duration in milliseconds

    let elapsedTime = 0;
    const piece = this.selectedPiece;
    const srcTile = this.board.getTile(piece.row, piece.col);

    // Linear interpolation function
    function lerp(start, end, t) {
      return start + t * (end - start);
    }
    const moveFunction = (delta) => {
      elapsedTime += (delta / 60) * 1000;
      if (elapsedTime >= animationDuration) {
        piece.row = tile.row;
        piece.col = tile.col;
        piece.leaveCurrentTile();
        piece.occupyTile(tile);
        this.deselectPiece();
        this.app.ticker.remove(moveFunction); // Remove the update listener

      } else {
        const t = elapsedTime / animationDuration;
        piece.x = lerp(startingPosition.x, destination.x, t);
        piece.y = lerp(startingPosition.y, destination.y, t);
      }
    };
      this.app.ticker.add(moveFunction);

  }

  /**
   * Switches the current player
   */
  switchPlayerTurn() {
    this.currentPlayer = this.currentPlayer.id === 1 ? this.players[1] : this.players[0];
    if (this.currentPlayer instanceof RandomAI){
      this.currentPlayer.perform(this);
    }
  }




}
