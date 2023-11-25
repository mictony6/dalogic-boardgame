import GameBoard from "./GameBoard";
import Player from "./Player";
import MoveValidator from "./MoveValidator";
import RandomAI from "./RandomAI";
import StateManager from "./StateManager";
import InputManager from "./InputManager";
import Operations from "./Operations";
import GameRenderer from "./GameRenderer";
import GameEventManager from "./GameEventManager";
import { ReadyEvent, ScoreEvent } from "./GameEvent";
import GameModeFactory from "./GameModeFactory";
import MiniMaxAI from "./MiniMaxAI";

const GameMode = new GameModeFactory();

/**
 * Manager class which handles the general interaction between game elements.
 */
export class GameManager {
  isPaused = false;

  /**
   * @type {Player[]}
   */
  players = [];

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
   * @type {Move}
   */
  currentMove = null;

  gameOver = false;

  /**
   *
   * @param {Application} app
   */
  constructor(app) {
    this.app = app;
    this.boardDimension = [app.screen.width / 64, app.screen.height / 64];
    this.renderer = new GameRenderer(app);
    this.board = new GameBoard(
      this.boardDimension[0],
      this.boardDimension[1],
      64,
      this.app,
    );
    this.moveValidator = new MoveValidator(this.board);
    this.gameMode = GameMode.PlayerVsAI;
    this.stateManager = new StateManager(this, "playing");
    this.inputManager = new InputManager(this, this.stateManager);
    this.eventManager = new GameEventManager();
  }

  /**
   *
   * @return {Piece[]}
   */
  get pieces() {
    return this.board.pieces;
  }

  gameStart() {
    this.currentPlayer = this.players[1];
    this.switchPlayerTurn();
    this.eventManager.trigger(new ReadyEvent(this));
    this.app.ticker.add(this.update.bind(this));
    this.app.ticker.start();
  }

  loadPlayers() {
    this.players.length = 0;
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
      player2 = new MiniMaxAI("Player 2", 2, 0x00b0af);
    } else if (this.gameMode === GameMode.AIVsAI) {
      player1 = new RandomAI("Player 1", 1, 0xaf2010);
      player2 = new RandomAI("Player 2", 2, 0x00b0af);
    }
    if (player1 && player2) {
      player1.setDirectionUp();
      player2.setDirectionDown();
      this.players.push(player1);
      this.players.push(player2);
    } else {
      throw new Error("Invalid game mode");
    }
  }

  loadGame() {
    this.renderer.addElement(this.board);

    const player1 = this.players[0];
    const player2 = this.players[1];

    // Generate pieces for both players
    this.board.generatePieces(this.players);

    player1.initPieces();
    player2.initPieces();
    this.inputManager.initialize();
  }

  /**
   * Performs a tile operation on two pieces and returns the result.
   * @param a {Number}
   * @param b {Number}
   * @param operation
   * @return {*}
   */
  performTileOperation(a, b, operation) {
    let res;
    if (operation === "AND") {
      res = Operations.and(a, b);
    } else if (operation === "OR") {
      res = Operations.or(a, b);
    } else if (operation === "XOR") {
      res = Operations.xor(a, b);
    } else if (operation === "NAND") {
      res = Operations.nand(a, b);
    }

    // console.log(
    //   `${a.toString()} ${operation} ${b.toString()} = ${res.toString()}`,
    // );

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
    this.showValidMoves(this.currentPlayer);
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
      return;
    }
    let isInValidMoves = false;
    for (let i = 0; i < this.currentPlayer.validMoves.length; i++) {
      const move = this.currentPlayer.validMoves[i];
      if (move.destTile === tile) {
        this.selectedTile = tile;
        if (move.isCaptureMove) {
          move.capturedPiece = move.destTile.piece;

          // Get the destination tile for the capturing piece
          move.destTile = this.board.getTile(
            move.destTile.row + move.piece.player.direction,
            move.destTile.col + move.moveColDiff,
          );

          this.currentMove = move;
          this.resetTileTints();
          isInValidMoves = true;
          break;
        }
        this.currentMove = move;
        // this.executeMove(move);
        isInValidMoves = true;
        break;
      }
    }

    if (!isInValidMoves) {
      this.deselectTile();
      this.deselectPiece();
    }
  }

  deselectTile() {
    if (this.selectedTile) {
      this.selectedTile = null;
    }
  }

  /**
   * Restores tile color to their default color (black or white).
   */
  resetTileTints() {
    this.board.tiles.flat().forEach((tile) => {
      tile.tint = tile.isBlack ? 0x111111 : 0xeeeeee;
    });
  }

  /**
   * Returns all valid move of certain piece.
   * @param {Piece} piece
   * @return {Move[]}
   */
  getValidMoves(piece) {
    const moves = this.getAllMoves(piece);
    return moves.filter((move) => this.moveValidator.validateMove(move));
  }

  /**
   *
   * @param player {Player}
   * @return {Move[]}
   */
  getAllMovesForPlayer(player) {
    const moves = [];
    player.ownedPieces.forEach((piece) => {
      moves.push(...this.getValidMoves(piece));
    });
    return moves;
  }

  /**
   * Returns all possible diagonal moves for a piece. Does not check if the move is valid.
   * @param piece {Piece}
   * @return {Move[]}
   */
  getAllMoves(piece) {
    // players can only move forward
    return [
      this.board.createMove(piece, [
        piece.row + piece.player.direction,
        piece.col + 1,
      ]),
      this.board.createMove(piece, [
        piece.row + piece.player.direction,
        piece.col - 1,
      ]),
    ];
  }

  /**
   * Highlights all valid moves for a piece.
   * @param player {Player}
   */
  showValidMoves(player) {
    const piece = this.selectedPiece;

    // Reset the tint for all tiles
    this.resetTileTints();

    player.validMoves = this.getValidMoves(piece);
    player.validMoves.forEach((move) => {
      // check if capture move

      const tile = move.destTile;
      tile.tint = 0x005f90; // Apply tint to valid tiles
    });
  }

  moveToward(from, to, delta) {
    const diff = to - from;

    const direction = diff > 0 ? 1 : diff < 0 ? -1 : 0;

    // Calculate the absolute difference
    const absDiff = Math.abs(diff);

    // Check if the absolute difference is less than or equal to the specified delta
    if (absDiff <= delta || absDiff < Number.EPSILON) {
      // If so, return the target value
      return to;
    }
    // Otherwise, calculate the new position by moving towards the target
    return from + direction * delta;
  }

  updateMoving() {
    if (this.isPaused) return;
    const move = this.currentMove;
    const tile = move.destTile;
    const piece = this.selectedPiece;
    // tint the tile green
    tile.tint = 0x00ff00;

    const destination = {
      x: tile.x + this.board.x,
      y: tile.y + this.board.y,
    };

    this._movePieceTowards(piece, destination);

    if (piece.x === destination.x && piece.y === destination.y) {
      piece.row = tile.row;
      piece.col = tile.col;
      piece.leaveCurrentTile();
      piece.occupyTile(tile);
      this.deselectPiece();
      this.currentMove = null;
      this.stateManager.currentState = "switchingTurn";
    }
  }

  /**
   * Private function to move the piece a bit towards the destination in a certain speed
   * @param {Piece} piece
   * @param {Object} destination
   */
  _movePieceTowards(piece, destination) {
    const SPEED = 5;
    const { deltaTime } = this.app.ticker;
    piece.x = this.moveToward(piece.x, destination.x, SPEED * deltaTime);
    piece.y = this.moveToward(piece.y, destination.y, SPEED * deltaTime);
  }

  /**
   * Switches the current player. If the player is an AI, calls their respective perform() method.
   */
  switchPlayerTurn() {
    // set the previous players pieces eventMode to none
    this.currentPlayer.disable();

    // set current player to the other player
    this.currentPlayer =
      this.currentPlayer.id === 1 ? this.players[1] : this.players[0];
    if (
      this.currentPlayer instanceof RandomAI ||
      this.currentPlayer instanceof MiniMaxAI
    ) {
      this.board.disableTiles();
    } else {
      // set the current players pieces eventMode to static
      this.board.enableTiles();
      this.currentPlayer.enable();
    }

    this.stateManager.currentState = "playing";
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

    const pieces = this.pieces;
    pieces.forEach((piece) => {
      piece.renderPieceValue();
    });

    const tiles = this.board.tiles.flat();

    tiles.forEach((tile) => {
      tile.renderOperation();
    });

    if (
      this.stateManager.transitions[this.stateManager.currentState] &&
      this.stateManager.transitions[this.stateManager.currentState].update
    ) {
      this.stateManager.transitions[this.stateManager.currentState].update(
        delta,
      );
    }
  }

  /**
   * Logic for the "playing" state for every frame
   * @param delta
   */
  updatePlaying(delta) {
    if (this.isPaused) {
      console.log("Game Paused");
      this.stateManager.currentState = "paused";
    }

    if (this.selectedPiece && this.selectedTile && this.currentMove) {
      if (this.currentMove.capturedPiece) {
        this.stateManager.currentState = "capturing";
        return;
      }
      this.stateManager.currentState = "moving";
      return;
    }
    if (
      this.currentPlayer instanceof RandomAI ||
      this.currentPlayer instanceof MiniMaxAI
    ) {
      this.currentPlayer.perform(this);
    }
  }

  /**
   * Logic for the "paused" state for every frame
   * @param delta
   */
  updatePaused(delta) {
    if (!this.isPaused) {
      console.log("Game Resumed");
      if (this.currentMove) {
        this.stateManager.currentState = "moving";
        return;
      }
      this.stateManager.currentState = "playing";
    }
  }

  /**
   *
   * @param move {Move}
   */
  performCapture(move) {
    // tint the tile green
    move.destTile.tint = 0x00ff00;

    move.capturedPiece = move.destTile.piece;
    // Get the destination tile for the capturing piece
    move.destTile = this.board.getTile(
      move.destTile.row + move.piece.player.direction,
      move.destTile.col + move.moveColDiff,
    );

    this.currentMove = move;
    this.stateManager.currentState = "capturing";
  }

  updateCapturing() {
    if (this.isPaused) return;

    const move = this.currentMove;
    const { piece } = move;
    const targetPiece = move.capturedPiece;
    const tile = move.destTile;
    tile.tint = 0x00ff00;

    const destination = {
      x: tile.x + this.board.x,
      y: tile.y + this.board.y,
    };

    // move the piece a bit towards the destination
    this._movePieceTowards(piece, destination);

    // Disable target piece's input detection and remove it from the player's owned piece set
    targetPiece.eventMode = "none";
    // also remove it from the board's piece set
    targetPiece.player.freePiece(targetPiece, this.board);

    if (piece.x === destination.x && piece.y === destination.y) {
      piece.row = tile.row;
      piece.col = tile.col;
      piece.leaveCurrentTile();
      piece.occupyTile(tile);
      this.deselectPiece();
      this.currentMove = null;

      // Free the tile from the target piece
      targetPiece.leaveCurrentTile();
      // Update capturing piece and its corresponding tile locations
      piece.pieceValue = this.performTileOperation(
        piece.pieceValue,
        targetPiece.pieceValue,
        move.destTile.operation,
      );
      piece.leaveCurrentTile();
      piece.occupyTile(move.destTile);

      // Run player logic for capturing a piece
      this.currentPlayer.onCapture(move);
      this.eventManager.trigger(new ScoreEvent(move.capturedPiece.player));

      // Trigger a score event for the capturing player
      this.eventManager.trigger(new ScoreEvent(piece.player));

      this.stateManager.currentState = "switchingTurn";
    }
  }

  updateGameOver() {}

  evaluate() {
    const p1 = this.currentPlayer;
    const p2 = this.players.find((player) => player !== p1);

    const p1Score = p1.score;
    const p2Score = p2.score;

    return p1Score - p2Score;
  }

  isGameOver() {
    return this.gameOver;
  }
}
