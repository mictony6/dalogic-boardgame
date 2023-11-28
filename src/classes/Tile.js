import {Sprite, Graphics, Text, TextStyle} from 'pixi.js';
import Operations from './Operations';
export default class Tile extends Sprite {
    id = 0;
    constructor(row, col, tileSize, isBlack, id, app) {
        const textureColor = isBlack ? 0x000000 : 0xffffff; // Black or white tile
        const texture = new Graphics();
        texture.beginFill(textureColor);
        texture.drawRect(0, 0, tileSize, tileSize);
        texture.endFill();

        super(app.renderer.generateTexture(texture));

        this.row = row;
        this.col = col;
        this.isBlack = isBlack;

        this.occupied = false;
        /**
     *
     * @type {Piece}
     */
        this.piece = null;
        // this._operation = Operations.operations[Math.floor(Math.random() * Operations.operations.length)];
        this.id = id;
        this._operation = Operations.operations[this.id % Operations.operations.length];

        if (!this.isBlack){
            this.text = new Text(this.operation, new TextStyle({
                fill: this.isBlack ? 0xffffff : 0x000000,
                fontSize: 16
            }));

            this.text.anchor.set(0.5);
            this.addChild(this.text);
        }

    }

    set col(val) {
        this._col = val;
        this.x = val * this.width;
    }

    set row(val) {
        this._row = val;
        this.y = val * this.height;
    }

    get col() {
        return this._col;
    }

    get row() {
        return this._row;
    }



    get isWhite() {
        return !this.isBlack;
    }

    setPiece(piece) {
        this.piece = piece;
        this.occupied = true;
    }

    removeCurrentPiece() {
        this.piece = null;
        this.occupied = false;
    }

    get operation() {
        return this._operation;
    }

    set operation(val) {
        if (!Operations.operations.includes(val)) throw Error('Invalid operation');
        this._operation = val;
    }

    renderOperation(){
        if (this.isBlack)return;

        this.text.text = this.operation;

        // Calculate the center coordinates of the circle
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        // Position text at the center of the circle
        this.text.position.set(centerX, centerY);
    }




}
