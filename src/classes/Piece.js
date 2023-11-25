import { Graphics, Sprite, Text, TextStyle } from "pixi.js";

// @ts-ignore
export default class Piece extends Sprite {
  /**
   *
   * @type {Player}
   */
  player = null;

  _binRep = "";

  _pieceValue = 0;

  constructor(row, col, tileSize, app) {
    const texture = new Graphics();

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
    this.binRep = "00";
    // generate random number between 0 and 3
    this.pieceValue = Math.floor(Math.random() * 4);

    this.eventMode = "none";

    // Create text
    this.text = new Text(
      this.binRep,
      new TextStyle({
        fill: 0xffffff,
        fontSize: 24,
      }),
    );

    // Set text anchor to center
    this.text.anchor.set(0.5);

    // Add text as a child of the piece
    this.addChild(this.text);
  }

  get pieceValue() {
    return this._pieceValue;
  }

  get binRep() {
    return this._binRep;
  }

  set binRep(val) {
    this._binRep = val;
  }

  set pieceValue(val) {
    this._pieceValue = val;
    // return a string representation of the value in binary, add padding if value is 1 or 0
    const binaryString = this._pieceValue.toString(2);
    // Calculate the number of leading zeros needed for padding
    const paddingZeros = Math.max(0, 2 - binaryString.length);
    // Add leading zeros for padding
    this._binRep = "0".repeat(paddingZeros) + binaryString;
  }

  /**
   *
   * @param player {Player}
   */
  assignPlayer(player) {
    this.player = player;
    this.tint = player.color;
    player.ownedPieces.push(this);
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
   * Display pieceValue over the piece
   */
  renderPieceValue() {
    this.text.text = this.binRep;
    // Calculate the center coordinates of the circle
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    // Position text at the center of the circle
    this.text.position.set(centerX, centerY);
  }
}
