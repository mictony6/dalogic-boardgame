import * as PIXI from 'pixi.js';
import './style.css';
import { GameManager } from "./classes/GameManager";
import { GameRenderer } from "./classes/GameRenderer";



const pauseButton = document.getElementById('pauseButton');
const reloadTileButton = document.getElementById('reloadTiles');
const passButton = document.getElementById('passButton');
const centerDiv = document.getElementById("center");

const app = new PIXI.Application({
  background: '#74bbde',
  width: 64 * 8,
  height: 64 * 8,
  antialias: true,
});

globalThis.__PIXI_APP__ = app;

const canvasStyle = app.renderer.view.style;
if (canvasStyle instanceof CSSStyleDeclaration) {
  canvasStyle.position = 'absolute';
  // @ts-ignore
  centerDiv.appendChild(app.view);
} else {
  console.error('canvas style is not an instance of CSSStyleDeclaration');
}

const renderer = new GameRenderer(app);
const gameManager = new GameManager(app, renderer);


if (pauseButton) {
  pauseButton.onclick = () => {
    gameManager.isPaused = !gameManager.isPaused
    pauseButton.innerText = gameManager.isPaused ? "resume" : "pause"
  }
} else {
  console.error('Pause button not found!');
}

if (reloadTileButton) {
  reloadTileButton.onclick = () => {
    gameManager.board.regenerateTileOperations()
  }
}

if (passButton) {
  passButton.onclick = () => {
    gameManager.switchPlayerTurn()
  }
}

gameManager.start()