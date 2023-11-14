import * as PIXI from 'pixi.js';
import './style.css';
import {GameManager} from "./classes/GameManager";
import {GameRenderer} from "./classes/GameRenderer";



const pauseButton = document.getElementById('pauseButton');

const app = new PIXI.Application({
  background: '#74bbde',
  width:600,
  height:600,
  antialias: true,
});

globalThis.__PIXI_APP__ = app;

app.renderer.view.style.position = 'absolute';
document.body.appendChild(app.view);

const renderer = new GameRenderer(app);
const gameManager = new GameManager(app, renderer);

let isPageVisible = true;

if (typeof document.hidden !== 'undefined') {
  // Standard Page Visibility API supported
  document.addEventListener('visibilitychange', handleVisibilityChange);
} else if (typeof document.msHidden !== 'undefined') {
  // IE 9 and older
  document.addEventListener('msvisibilitychange', handleVisibilityChange);
} else if (typeof document.webkitHidden !== 'undefined') {
  // Webkit (Chrome, Safari, etc.)
  document.addEventListener('webkitvisibilitychange', handleVisibilityChange);
}
function handleVisibilityChange() {
  if (document.hidden || document.msHidden || document.webkitHidden) {
    // Page is not visible, pause the game
    isPageVisible = false;
    gameManager.pauseGame();
  } else {
    // Page is visible, resume the game
    isPageVisible = true;
    gameManager.resumeGame();
  }
}

if (pauseButton) {
  pauseButton.onclick =() => {
    if(gameManager.isPaused) {
      pauseButton.innerText = "Pause"
      gameManager.resumeGame();
    } else {
      pauseButton.innerText = "Resume"
      gameManager.pauseGame();
    }
  }
} else {
  console.error('Pause button not found!');
}

gameManager.start()