import { GameBoard } from "./GameBoard";
import { Player } from "./Player";
import { MoveValidator } from "./MoveValidator";
import { RandomAI } from "./RandomAI";
import { StateManager } from "./StateManager";
import { InputManager } from "./InputManager";
import { Piece } from "./Piece";
import { Operations } from "./Operations";
import { Application, Renderer } from "pixi.js";
import { GameRenderer } from "./GameRenderer";


class GameModeFactory {
  PlayerVsPlayer = 0;
  PlayerVsAI = 1;
  AIVsAI = 2;
  constructor() {
    Object.freeze(this);
  }
}

const GameMode = new GameModeFactory();

/**
 * Manager class which handles the general interaction between game elements.
 */
export class GameManager {
  isPaused = false;
  /**
   * @type {Piece[]}
   */
  pieces = []
  /**
   * @type {Player[]}
   */
  players = []
  /**
   *
   * @type {Piece}
   */
  selectedPiece = null;
  /**
   *
   * @type {Tile}
   */
  selectedTile = null;
  /**
   *
   * @type {Player}
   */
  currentPlayer = null;

  /**
   * 
   * @param {Application} app 
   * @param {GameRenderer} renderer 
   */
  constructor(app, renderer) {
    this.app = app;
    this.renderer = renderer;
    this.boardDimension = [app.screen.width / 64, app.screen.height / 64];
    this.board = new GameBoard(this.boardDimension[0], this.boardDimension[1], 64, this.app)
    this.moveValidator = new MoveValidator(this.board);
    this.gameMode = GameMode.AIVsAI;
    this.stateManager = new StateManager(this, "playing");
    this.inputManager = new InputManager(this, this.stateManager);

  }

  start() {
    // Initialize your game here
    this.loadGame();
    this.app.ticker.add(this.update.bind(this));
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
      player1 = new Player("Player 1", 1, 0xaf2010);
      player2 = new Player("Player 2", 2, 0x00b0af);

    } else if (this.gameMode === GameMode.PlayerVsAI) {
      player1 = new Player("Player 1", 1, 0xaf2010);
      player2 = new RandomAI("Player 2", 2, 0x00b0af);
    } else if (this.gameMode === GameMode.AIVsAI) {
      player1 = new RandomAI("Player 1", 1, 0xaf2010);
      player2 = new RandomAI("Player 2", 2, 0x00b0af);

    }
    if (player1 && player2) {

      player1.setDirectionUp()
      player2.setDirectionDown()
      this.players.push(player1);
      this.players.push(player2);

    } else {
      throw new Error("Invalid game mode")
    }

    this.renderer.addElement(this.board);

    this.loadPiecesForPlayer(player1, this.boardDimension[0] - 1);
    this.loadPiecesForPlayer(player1, this.boardDimension[0] - 2);
    this.loadPiecesForPlayer(player2, 0);
    this.loadPiecesForPlayer(player2, 1);

    this.inputManager.initialize();

    this.currentPlayer = player2;
    this.switchPlayerTurn();
  }

  /**
   *
   * @param move {Move}
   * @return Boolean
   */
  async performCapture(move) {
    /**
     * @type {Piece}
     */
    let capturingPiece = move.piece;

    /**
     * @type {Piece}
     */
    let targetPiece = move.destTile.piece;
    move.capturedPiece = targetPiece;

    // disable target piece's input detection
    targetPiece.eventMode = 'none';


    // remove target piece from players owned piece set
    targetPiece.player.freePiece(targetPiece);

    // free tile from target piece
    targetPiece.leaveCurrentTile();

    move.destTile = this.board.getTile(move.destTile.row + move.piece.player.direction, move.destTile.col + move.moveColDiff);
    capturingPiece.pieceValue = this.performTileOperation(capturingPiece.pieceValue, targetPiece.pieceValue, move.destTile.operation);




    // update capturing piece and its corresponding tile locations

    capturingPiece.leaveCurrentTile()
    capturingPiece.occupyTile(move.destTile);
    this.executeMove(move);

    // run player logic for capturing a piece
    this.currentPlayer.onCapture(move)
    this.switchPlayerTurn();
    this.renderer.removeElement(targetPiece);
    return true;
  }

  performTileOperation(a, b, operation) {
    let res;
    if (operation === 'AND') {
      res = Operations.and(a, b)
    } else if (operation === 'OR') {
      res = Operations.or(a, b)
    } else if (operation === 'XOR') {
      res = Operations.xor(a, b)
    } else if (operation === 'NAND') {
      res = Operations.nand(a, b)
    }

    console.log(a.toString() + " " + operation + " " + b.toString() + " = " + res.toString())

    return res;
  }

  /**
   * Gets called when player selects a piece and highlights its valid moves
   * @param piece { Piece} The selected piece
   */
  selectPiece(piece) {
    if (piece.player !== this.currentPlayer) {
      this.resetTileTints();
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
        if (move.isCaptureMove) {
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

  /**
   * Restores tile color to their default color (black or white).
   */
  resetTileTints() {
    this.board.tiles.flat().forEach(tile => {
      tile.tint = tile.isBlack ? 0x111111 : 0xeeeeee;
    });
  }


  /**
   * Returns all valid move of certain piece.
   * @param {Piece} piece 
   * @returns {Move[]}
   */
  getValidMoves(piece) {
    const moves = this.getAllMoves(piece);
    return moves.filter(move => this.moveValidator.validateMove(move))
  }

  /**
   * Returns all possible diagonal moves for a piece. Does not check if the move is valid.
   * @param piece {Piece}
   * @returns {Move[]}
   */
  getAllMoves(piece) {
    // players can only move forward
    return [
      this.board.createMove(piece, [piece.row + piece.player.direction, piece.col + 1]),
      this.board.createMove(piece, [piece.row + piece.player.direction, piece.col - 1])
    ];
  }

  /**
   * Highlights all valid moves for a piece.
   */
  showValidMoves() {
    let piece = this.selectedPiece;

    // Reset the tint for all tiles
    this.resetTileTints();

    this.currentPlayer.validMoves = this.getValidMoves(piece);
    this.currentPlayer.validMoves.forEach(move => {
      // check if capture move
      if (this.moveValidator.validateCaptureMove(move)) {
        move.isCaptureMove = true;
      }

      let tile = move.destTile;
      tile.tint = 0x005f90; // Apply tint to valid tiles
    });
  }


  /**
   * Executes a move and animates the piece. Note: This does not check if the move is valid.
   * @param move {Move}
   */
  executeMove(move) {

    const tile = move.destTile;
    //tint the tile green
    tile.tint = 0x00ff00;

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
   * Switches the current player. If the player is an AI, calls their respective perform() method.
   */
  switchPlayerTurn() {


    // set the previous players pieces eventMode to none
    this.currentPlayer.disable()

    // set current player to the other player
    this.currentPlayer = this.currentPlayer.id === 1 ? this.players[1] : this.players[0];

    if (this.currentPlayer instanceof RandomAI) {
      this.board.disableTiles();
      this.currentPlayer.disable();
      this.currentPlayer.perform(this).then(() => { })
    } else {
      // set the current players pieces eventMode to static
      this.board.enableTiles();
      this.currentPlayer.enable()

    }
  }


  /**
   * Method that is being called every frame.
   * @param delta 
   */
  update(delta) {
    /**
     * render piece value on top of the pieces
     * @type {Piece[]}
     */
    let pieces = [...this.players[0].ownedPieces, ...this.players[1].ownedPieces];
    pieces.forEach(piece => {
      piece.renderPieceValue();
    });

    let tiles = this.board.tiles.flat();

    tiles.forEach(tile => {
      tile.renderOperation();
    })

    if (this.stateManager.transitions[this.stateManager.currentState] && this.stateManager.transitions[this.stateManager.currentState].update) {
      this.stateManager.transitions[this.stateManager.currentState].update(delta);
    }
  }

  /**
   * Logic for the "playing" state for every frame
   * @param delta 
   */
  updatePlaying(delta) {


    if (this.isPaused) {
      console.log("Game Paused")
      this.stateManager.currentState = 'paused';
    }
  }

  /**
 * Logic for the "paused" state for every frame
 * @param delta 
 */
  updatePaused(delta) {
    //.
    if (!this.isPaused) {
      console.log("Game Resumed")

      this.stateManager.currentState = 'playing';
    }
  }


}
