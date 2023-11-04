import * as PIXI from 'pixi.js';
import {Sprite} from "pixi.js";

export class Tile extends Sprite {
  constructor(row, col,  tileSize, isBlack, app) {
    const textureColor = isBlack ? 0x000000 : 0xffffff; // Black or white tile
    const texture = new PIXI.Graphics();
    texture.beginFill(textureColor);
    texture.drawRect(0,0, tileSize,tileSize);
    texture.endFill();

    super(app.renderer.generateTexture(texture));

    this.row = row;
    this.col = col;
    this.isBlack = isBlack;

    this.interactive = true; // Enable interaction

    this.occupied = false;
    this.piece = null;
  }

  set col(val){
    this._col = val;
    this.x = val * this.width;
  }

  set row(val){
    this._row = val;
    this.y = val * this.height;
  }

  get col(){
    return this._col;
  }

  get row(){
    return this._row;
  }



  get isWhite(){
    return !this.isBlack
  }




}
