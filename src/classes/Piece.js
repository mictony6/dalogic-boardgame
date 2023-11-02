import {Graphics, Sprite} from "pixi.js";

export class Piece extends Sprite{
  player = null;
  constructor(row, col, tileSize,  app){

    let texture = new Graphics();

    texture.beginFill(0xff0000);
    texture.drawCircle(0, 0, tileSize/2);
    texture.endFill();

    super(app.renderer.generateTexture(texture));

    this.position.x = col * tileSize ;
    this.position.y = row * tileSize ;


    this._row = row;
    this._col = col;
    this.tileSize = tileSize;
    this.app = app;


  }

  assignPlayer(player){
    this.player = player;
    this.tint = player.color;
  }

  set col(val){
    this._col = val;
    this.x = val * this.tileSize;
  }

  set row(val){
    this._row = val;
    this.y = val * this.tileSize;
  }

  get col(){
    return this._col;
  }

  get row(){
    return this._row;
  }



}