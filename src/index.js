import * as PIXI from 'pixi.js';
import './style.css';
import { GameManager } from "./classes/GameManager";
import { GameRenderer } from "./classes/GameRenderer";
import { ScoreEvent } from './classes/GameEvent';



const pauseButton = document.getElementById('pauseButton');
const reloadTileButton = document.getElementById('reloadTiles');
const passButton = document.getElementById('passButton');
const centerDiv = document.getElementById("center");
const scoreBoard = document.getElementById("scores");

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
const gameEventManager = gameManager.eventManager;


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

gameManager.loadGame();

const players = gameManager.players;
const playerElements = []
players.forEach(player => {
  let element = document.createElement("div");
  element.id = `player${player.id}`

  element.innerHTML = `
    ${player.name}: ${player.score}
  `
  scoreBoard.append(element)
  playerElements.push(element);
})

/**
 * Handle the 'score' event.
 * @param {ScoreEvent} e - The score event.
 */
function onScore(e) {
  const player = e.scoringPlayer;
  const playerElement = playerElements[player.id - 1];

  if (playerElement) {
    // Update the specific node containing the score, assuming score is the only child
    const scoreNode = playerElement.firstChild;
    if (scoreNode) {
      scoreNode.nodeValue = `${player.name}: ${player.score}`;
    } else {
      console.error(`Score node not found for player ${player.name}`);
    }
  } else {
    console.error(`Player element not found for player ${player.name}`);
  }
}


gameEventManager.on("score", onScore)

gameManager.start();
