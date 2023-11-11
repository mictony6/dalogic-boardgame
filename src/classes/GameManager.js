import { GameBoard } from "./GameBoard";
import { Piece } from "./Piece";
import { Player } from "./Player";
import { MoveValidator } from "./MoveValidator";
import {RandomAI} from "./RandomAI";
import {log} from "debug";

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
    /**
     *
     * @type {Piece}
     */
    this.selectedPiece = null;
    /**
     *
     * @type {Tile}
     */
    this.selectedTile = null;
    /**
     *
     * @type {Player}
     */
    this.currentPlayer = null;
    this.moveValidator = new MoveValidator(this.board);
    this.gameMode = GameMode.AIVsAI;

  }

  start() {
    // Initialize your game here
    this.loadGame();
    this.app.ticker.add(this.updateAll.bind(this));
  }

  loadTiles() {
    this.board.tiles.flat().forEach(tile => {
      tile.on('pointerdown', () => {
        this.selectTile(tile);
      });
    });
  }

  /**
   * Gets called when player selects a tile
   * @param tile {Tile}
   */
  selectTile(tile) {
    if (!this.selectedPiece) {

      throw Error("No piece selected")
    }


    let isInValidMoves = false;
    for (let i = 0; i < this.currentPlayer.validMoves.length; i++) {
      let move = this.currentPlayer.validMoves[i];
      if (move.destTile === tile) {
        if (move.isCaptureMove){
          this.performCapture(move);
          this.resetTileTints();
          isInValidMoves = true;
          break;
        }

        this.switchPlayerTurn();
        this.executeMove(move);
        isInValidMoves = true;
        break;
      }
    }


    if (!isInValidMoves) {
      this.deselectPiece();
    }
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

      player.ownedPieces.push(piece);
    }
  }

  loadGame() {
    /**
     * @type {Player}
     */
    let player1 = null;
    /**
     * @type {Player}
     */
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
    if (player1 && player2){

      player1.setDirectionUp()
      player2.setDirectionDown()
      this.players.push(player1);
      this.players.push(player2);

    } else {
      throw new Error("Invalid game mode")
    }

    this.renderer.addElement(this.board);

    this.loadPiecesForPlayer(player1, 7);
    this.loadPiecesForPlayer(player1, 6);
    this.loadPiecesForPlayer(player2, 0);
    this.loadPiecesForPlayer(player2, 1);
    this.loadTiles();

    this.currentPlayer = player2;
    this.switchPlayerTurn();
  }

  /**
   *
   * @param move {Move}
   * @return Boolean
   */
  performCapture(move){
    /**
     * @type {Piece}
     */
    let capturingPiece = move.piece;
    /**
     * @type {Piece}
     */
    let targetPiece = move.destTile.piece;

    // disable target piece's input detection
    targetPiece.eventMode = 'none';


    // remove target piece from players owned piece set
    targetPiece.player.freePiece(targetPiece);

    // free tile from target piece
    targetPiece.leaveCurrentTile();

    this.switchPlayerTurn();

    move.destTile = this.board.getTile(move.destTile.row + move.piece.player.direction, move.destTile.col + move.moveColDiff);

    // update capturing piece and its corresponding tile locations
    capturingPiece.leaveCurrentTile()
    capturingPiece.occupyTile(move.destTile);

    this.executeMove(move);
    this.renderer.removeElement(targetPiece);
    return true;
  }

  /**
   * Gets called when player selects a piece and highlights its valid moves
   * @param piece { Piece}
   */
  selectPiece(piece) {
    if (piece.player !== this.currentPlayer) {


      // if (!this.performCapture(this.selectedPiece, piece)){

        this.resetTileTints();
      // }
      return;
    }

    this.deselectPiece(); // Deselect any previously selected piece and clear its valid moves

    // finally setting piece as selectedPiece
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
    return moves.filter(move => this.moveValidator.validateMove( move))
  }

  /**
   * Returns all possible diagonal moves for a piece. Does not check if the move is valid.
   * @param piece {Piece}
   * @returns {Array<Move>}
   */
  getAllMoves(piece){
    // // players can only move forward
    return [
      this.board.createMove(piece, [piece.row + piece.player.direction, piece.col + 1]),
      this.board.createMove(piece, [piece.row + piece.player.direction, piece.col - 1])
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


    // this.filterCaptureMoves();
    this.currentPlayer.validMoves.forEach(move => {

      // check if capture move
      if (this.moveValidator.validateCaptureMove(move)){
        move.isCaptureMove = true;
      }

      let tile = move.destTile;
      tile.tint = 0x00ff00; // Apply tint to valid tiles
    });

  }




  // filterCaptureMoves(){
  //   let captureMoves = [];
  //   let newMoves = [];
  //
  //
  //   newMoves = this.currentPlayer.validMoves.filter(move => {
  //       if (this.moveValidator.validateCaptureMove(move)){
  //
  //         let captureMove = this.board.createMove(move.piece, [move.destTile.row + move.piece.player.direction, move.destTile.col + move.moveColDiff]);
  //         captureMoves.push(captureMove);
  //         return false;
  //       }
  //       return true;
  //   })
  //
  //   this.currentPlayer.validMoves = newMoves.concat(captureMoves);
  //   console.log(captureMoves);
  // }


  /**
   * Executes a move and animates the piece. Note: This does not check if the move is valid.
   * @param move {Move}
   */
  executeMove(move) {

    const tile = move.destTile;

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
    // set the previous players pieces eventMode to none
    this.currentPlayer.disable()
    // set current player to the other player
    this.currentPlayer = this.currentPlayer.id === 1 ? this.players[1] : this.players[0];
    if (this.currentPlayer instanceof RandomAI){
      this.board.disableTiles();
      this.currentPlayer.disable();
      this.currentPlayer.perform(this).then(r => {})
    }else{
      // set the current players pieces eventMode to static
      this.board.enableTiles();
      this.currentPlayer.enable()

    }
  }




}
