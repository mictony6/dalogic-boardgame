import { Graphics, Sprite, Text } from "pixi.js";
import { Player } from "./Player";
import { Tile } from "./Tile";

// @ts-ignore
export class Piece extends Sprite {
  /**
   *
   * @type {Player}
   */
  player = null;
  constructor(row, col, tileSize, app) {

    let texture = new Graphics();

    texture.beginFill(0xff0000);
    texture.drawCircle(0, 0, tileSize / 2);
    texture.endFill();

    super(app.renderer.generateTexture(texture));

    this.position.x = col * tileSize;
    this.position.y = row * tileSize;


    this._row = row;
    this._col = col;
    this.tileSize = tileSize;
    this.app = app;
    /**
     *
     * @type {Tile}
     */
    this.tile = null;
    this._pieceValue = 0;
    this.eventMode = 'static'


  }

  get pieceValue() {
    return this._pieceValue;
  }

  get binRep() {
    return this._pieceValue.toString(2);
  }

  set pieceValue(val) {
    this._pieceValue = val;
  }

  assignPlayer(player) {
    this.player = player;
    this.tint = player.color;
  }

  set col(val) {
    this._col = val;
    this.x = val * this.tileSize;
  }

  set row(val) {
    this._row = val;
    this.y = val * this.tileSize;
  }

  get col() {
    return this._col;
  }

  get row() {
    return this._row;
  }

  /**
   *
   * @param tile {Tile}
   */
  occupyTile(tile) {
    tile.setPiece(this);
    this.tile = tile;
  }


  leaveCurrentTile() {
    if (this.tile) {
      this.tile.removeCurrentPiece();
      this.tile = null;
    }
  }

  /**
   *
   * @param piece {Piece}
   * @return Boolean
   */
  capture(piece) {
    if (piece.player === this.player) {
      console.log("cant capture your own pieces")
      return false;
    }

    piece.eventMode = 'none';
    return true;
  }


}