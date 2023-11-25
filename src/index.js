import * as PIXI from "pixi.js";
import "./style.css";
import { GameManager } from "./classes/GameManager";
import { GameRenderer } from "./classes/GameRenderer";
import { ReadyEvent, ScoreEvent } from "./classes/GameEvent";

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");
const passButton = document.getElementById("passButton");
const centerDiv = document.getElementById("center");
const scoreBoard = document.getElementById("scores");

const app = new PIXI.Application({
  background: "#74bbde",
  width: 64 * 5,
  height: 64 * 5,
  antialias: true,
  autoStart: false,
});

globalThis.__PIXI_APP__ = app;

const canvasStyle = app.renderer.view.style;
if (canvasStyle instanceof CSSStyleDeclaration) {
  canvasStyle.position = "absolute";
  // @ts-ignore
  centerDiv.appendChild(app.view);
} else {
  console.error("canvas style is not an instance of CSSStyleDeclaration");
}

const gameManager = new GameManager(app);
const gameEventManager = gameManager.eventManager;

if (pauseButton) {
  pauseButton.onclick = () => {
    gameManager.isPaused = !gameManager.isPaused;
    pauseButton.innerText = gameManager.isPaused ? "resume" : "pause";
  };
} else {
  console.error("Pause button not found!");
}

if (passButton) {
  passButton.onclick = () => {
    gameManager.eventManager.currentState = "switchingTurn";
  };
}

if (startButton) {
  startButton.onclick = () => {
    gameManager.loadPlayers();

    gameManager.loadGame();

    gameManager.gameStart();
  };
}

const playerElements = [];

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

function onGameReady(e) {
  const players = gameManager.players;

  // Clear existing player elements
  playerElements.forEach((element) => {
    scoreBoard.removeChild(element);
  });
  playerElements.length = 0; // Clear the array

  players.forEach((player) => {
    let element = document.createElement("div");
    element.id = `player${player.id}`;
    element.innerHTML = `${player.name}: ${player.score}`;
    playerElements.push(element);
  });

  scoreBoard.append(...playerElements);
}

gameEventManager.on("score", onScore);
gameEventManager.on("ready", onGameReady);
