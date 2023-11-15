import { Tile } from "./Tile";
import { Application, Container } from "pixi.js";
import { Move } from "./Move";
import { Piece } from "./Piece";

/**
 * A class for the game board. This handles all logic for the tiles and creating moves that are in bounds of the board.
 */
export class GameBoard extends Container {
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
    this.tiles = []
    this.rows = rows;
    this.columns = columns;
    this.tileSize = tileSize;

    this.generateTiles()

  }

  /**
   * Generate a 2D array of tiles for the game board. 
   */
  generateTiles() {
    this.tiles = new Array(this.rows);
    for (let row = 0; row < this.rows; row++) {
      this.tiles[row] = new Array(this.columns);
      for (let col = 0; col < this.columns; col++) {
        this.tiles[row][col] = new Tile(row, col, this.tileSize, (row + col) % 2 === 1, this.app);
        this.addChild(this.tiles[row][col]);
      }
    }

  }

  /**
   * Get a tile object at specific row and column
   * @param {Number} row 
   * @param {Number} col 
   * @returns {Tile} A tile at (row, col)
   */
  getTile(row, col) {
    return this.tiles[row][col];
  }

  /**
   * Creates a move and specifies if its in bounds of the board or not.
   * @param {Piece} piece 
   * @param {Number[]} dest  [row, col]
   * @returns {Move}
   */
  createMove(piece, dest) {

    let move = new Move(piece, dest);

    if (dest[0] < 0 || dest[0] >= this.rows || dest[1] < 0 || dest[1] >= this.columns) {
      move.inBounds = false;
    } else {
      move.destTile = this.getTile(dest[0], dest[1]);
    }

    // check if dest is in bounds
    return move;
  }

  /**
   * Disables all event listener
   */
  disableTiles() {
    this.tiles.flat().forEach((tile) => {
      tile.eventMode = 'none'
    });
  }

  /**
   * Enables all tile event listener
   */
  enableTiles() {
    this.tiles.flat().forEach((tile) => {
      tile.eventMode = 'static';
    });
  }

}