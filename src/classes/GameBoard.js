import {Tile} from "./Tile";
import {Container} from "pixi.js";
import {Move} from "./Move";

export class GameBoard extends Container {
  constructor(rows, columns, tileSize, app) {
    super();
    this.app = app;
    this.tiles =[]
    this.rows = rows;
    this.columns = columns;
    this.tileSize = tileSize;

    this.generateTiles()

  }


  generateTiles(){
    this.tiles = new Array(this.rows);
    for (let row = 0; row < this.rows; row++){
      this.tiles[row] = new Array(this.columns);
      for (let col = 0; col < this.columns; col++){
        this.tiles[row][col] = new Tile(row, col, this.tileSize, (row + col) % 2 === 1, this.app);
        this.addChild(this.tiles[row][col]);
      }
    }

  }

  getTile(row, col){
    return this.tiles[row][col];
  }

  createMove(piece, dest){

    let move = new Move(piece, dest);

    if (dest[0] < 0 || dest[0] >= this.rows || dest[1] < 0 || dest[1] >= this.columns) {
      move.inBounds = false;
    }else {
      move.destTile = this.getTile(dest[0], dest[1]);
    }

    // check if dest is in bounds
    return move;
  }

  disableTiles(){
    this.tiles.forEach(tile => {
      tile.eventMode = "none";
    })
  }

  enableTiles() {
    this.tiles.forEach(tile => {
      tile.eventMode = "static";
    })
  }
}