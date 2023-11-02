import {GameBoard} from "./GameBoard";
import {Piece} from "./Piece";
import {Player} from "./Player";

export class GameManager {
  constructor(app, renderer) {
    this.app = app;
    this.renderer = renderer;
    this.board = new GameBoard(8, 8, 64, this.app)
    this.pieces = []
    this.players = []
    this.selectedPiece = null;
    this.selectedTile = null;
    this.currentPlayer = null;




  }

  start() {
    // Initialize your game here
    this.loadGame();
    this.app.ticker.add(this.updateAll.bind(this));
  }

  loadGame(){

    let player1 = new Player("Player 1", 1, 0xff0000);
    let player2 = new Player("Player 2", 2, 0x0000ff);
    this.players.push(player1);
    this.players.push(player2);

    this.currentPlayer = player1;

    this.renderer.addElement(this.board);
    for (let col = 0; col < this.board.columns; col++){
      const tile = this.board.getTile(7, col);
      if (tile.isBlack) continue;
      let piece = new Piece(7, col, 64, this.app);
      tile.occupied = true;

      piece.assignPlayer(player1);
      this.pieces.push(piece);
      this.renderer.addElement(piece);

      piece.on('pointerdown', () => {
        this.selectPiece(piece);

      });
      piece.eventMode = "static"
    }

    for (let col = 0; col < this.board.columns; col++){
      const tile = this.board.getTile(0, col);
      if (tile.isBlack) continue;
      let piece = new Piece(0, col, 64, this.app);
      tile.occupied = true;

      piece.assignPlayer(player2);
      this.pieces.push(piece);
      this.renderer.addElement(piece);

      piece.on('pointerdown', () => {
        this.selectPiece(piece);

      });
      piece.eventMode = "static"
    }

  }


  selectPiece(piece) {
    if (piece.player !== this.currentPlayer) {
      console.log("not yours")
      this.resetTileTints();
      return;
    };

    this.deselectPiece(); // Deselect any previously selected piece and clear its valid moves

    this.selectedPiece = piece;
    this.showValidMoves();
  }


  deselectPiece() {
    if (this.selectedPiece) {
      this.selectedPiece = null;
      this.currentPlayer.validMoves = [];
      this.resetTileTints();
    }
  }

  resetTileTints() {
    this.board.tiles.flat().forEach(tile => {
      tile.tint = tile.isBlack ? 0x000000 : 0xffffff;
    });
  }



  update(delta) {
    this.board.tiles.flat().forEach(tile => {
      tile.on('pointerdown', () => {
        if (!this.selectedPiece) return;

        if (this.currentPlayer.validMoves.find(validMove => validMove[0] === tile.row && validMove[1] === tile.col)) {
          this.movePiece(tile);
        } else {
          this.deselectPiece();
        }
      });
      tile.eventMode = "static";
    });
  }




  updateAll(delta){
    this.update(delta);
  }

  showValidMoves() {
    let piece = this.selectedPiece;
    let validMoves = []
    let row = piece.row;
    let col = piece.col;

    // Reset the tint for all tiles
    this.resetTileTints();

    // All diagonal moves
    const moveOffsets = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1]
    ];

    // Find which moves can be valid and apply tint to valid tiles
    moveOffsets.forEach(offset => {
      let move = [row + offset[0], col + offset[1]];
      if (this.board.isValidMove([piece.row, piece.col], move)) {
        validMoves.push(move);
        let tile = this.board.getTile(move[0], move[1]);
        tile.tint = 0x00ff00; // Apply tint to valid tiles
      }
    });

    this.currentPlayer.validMoves = validMoves;
  }


  // movePiece(tile) {
  //   this.selectedPiece.col = tile.col;
  //   this.selectedPiece.row = tile.row;
  //   this.switchPlayerTurn();
  //   this.deselectPiece();
  //
  // }

  movePiece(tile) {
    this.switchPlayerTurn();

    const destination = {
      x: tile.x + this.board.x,
      y: tile.y + this.board.y,
    };

    const startingPosition = {
      x: this.selectedPiece.x,
      y: this.selectedPiece.y,
    };

    const animationDuration = 500; // Duration in milliseconds
    let elapsedTime = 0;
    const piece = this.selectedPiece;

    // Linear interpolation function
    function lerp(start, end, t) {
      return start + t * (end - start);
    }
    const moveFunction = (delta) => {
      elapsedTime += (delta/60) * 1000;
      if (elapsedTime >= animationDuration) {
        piece.row = tile.row;
        piece.col = tile.col;
        this.deselectPiece();
        this.app.ticker.remove(moveFunction); // Remove the update listener

      } else {
        const t = elapsedTime / animationDuration;
        piece.x = lerp(startingPosition.x, destination.x, t);
        piece.y = lerp(startingPosition.y, destination.y, t);
      }
    };

    this.app.ticker.add(moveFunction);
  }




  switchPlayerTurn(){
    if (this.currentPlayer === this.players[0]){
      this.currentPlayer = this.players[1];
    } else {
      this.currentPlayer = this.players[0];
    }
  }
}
