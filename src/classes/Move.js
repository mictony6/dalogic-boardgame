export class Move {
    constructor(piece, dest) {
        this.piece = piece;
        this.destRow = dest[0];
        this.destCol = dest[1];
        /**
     *
     * @type {Tile}
     */
        this.destTile = null;
        this.inBounds = true;
        this.isCaptureMove = false;
        /**
     * The piece that was captured by this move.
     * @type {Piece}
     */
        this.capturedPiece = null;
    }

    capturePossible() {
        return (
            this.destTile.occupied && this.destTile.piece.player !== this.piece.player
        );
    }

    canMoveIntoTile() {
        return !this.destTile.occupied;
    }

    get moveColDiff() {
        return this.destCol - this.piece.col;
    }

    get moveRowDiff() {
        return this.destRow - this.piece.row;
    }
}
