import { Container } from "pixi.js";
import Tile from "./Tile";
import { Move } from "./Move";
import Piece from "./Piece";

/**
 * A class for the game board.
 * This handles all logic for the tiles and creating
 * moves that are in bounds of the board.
 */
export default class GameBoard extends Container {
  /**
   *
   * @param {Number} rows
   * @param {Number} columns
   * @param {Number} tileSize
   * @param {Application} app
   */
  constructor(rows, columns, tileSize, app) {
    super();
    this.app = app;
    this.tiles = [];
    this.pieces = [];
    this.rows = rows;
    this.columns = columns;
    this.tileSize = tileSize;

    this.generateTiles();
  }

  /**
   * Generate a 2D array of tiles for the game board.
   */
  generateTiles() {
    this.tiles = new Array(this.rows);
    for (let row = 0; row < this.rows; row += 1) {
      this.tiles[row] = new Array(this.columns);
      for (let col = 0; col < this.columns; col += 1) {
        this.tiles[row][col] = new Tile(
          row,
          col,
          this.tileSize,
          (row + col) % 2 === 1,
          (row*this.columns) + col + 1,
          this.app,
        );
        this.addChild(this.tiles[row][col]);
      }
    }
  }

  generatePieces(players) {
    const player1 = players[0];
    const player2 = players[1];

    for (let row = 0; row < this.rows / 2 - 1; row += 1) {
      for (let col = 0; col < this.columns; col++) {
        let player1Row = this.rows - row - 1;
        let player1Col = this.columns - col - 1;

        let player2Row = row;
        let player2Col = col;

        const tile1 = this.getTile(player1Row, player1Col);
        if (tile1.isBlack) continue;
        const piece = new Piece(player1Row, player1Col, 64, this.app);
        piece.assignPlayer(player1);
        piece.occupyTile(tile1);

        this.pieces.push(piece);
        this.addChild(piece);

        const tile2 = this.getTile(player2Row, player2Col);
        if (tile2.isBlack) continue;
        const piece2 = new Piece(player2Row, player2Col, 64, this.app);
        piece2.assignPlayer(player2);
        piece2.occupyTile(tile2);

        this.pieces.push(piece2);
        this.addChild(piece2);
      }
    }
  }

  /**
   * Get a tile object at specific row and column
   * @param {Number} row
   * @param {Number} col
   * @return {Tile} A tile at (row, col)
   */
  getTile(row, col) {
    return this.tiles[row][col];
  }

  /**
   * Creates a move and specifies if its in bounds of the board or not.
   * @param {Piece} piece
   * @param {Array} dest
   * @return {Move}
   */
  createMove(piece, dest) {
    /**
     * @type {Move}
     */
    const move = new Move(piece, dest);

    if (
      dest[0] < 0 ||
      dest[0] >= this.rows ||
      dest[1] < 0 ||
      dest[1] >= this.columns
    ) {
      move.inBounds = false;
    } else {
      move.destTile = this.getTile(dest[0], dest[1]);
    }

    // Check if dest is in bounds
    return move;
  }

  /**
   * Disables all event listener
   */
  disableTiles() {
    this.tiles.flat().forEach((tile) => {
      tile.eventMode = "none";
    });
  }

  /**
   * Enables all tile event listener
   */
  enableTiles() {
    this.tiles.flat().forEach((tile) => {
      tile.eventMode = "static";
    });
  }
}
