import {Tile} from "./Tile";
import {Container} from "pixi.js";

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

  isValidMove(src, dest) {

    //check if dest is in bounds
    if (dest[0] < 0 || dest[0] >= this.rows || dest[1] < 0 || dest[1] >= this.columns) return false;

    // get tiles from the board
    let destTile = this.getTile(dest[0], dest[1]);



    // check if dest tile is occupied
    if (destTile.occupied) return false;


    return true;

  }
}