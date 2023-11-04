import * as PIXI from 'pixi.js';
import './style.css';
import sample from "./images/sample.png";
import {GameManager} from "./classes/GameManager";
import {GameRenderer} from "./classes/GameRenderer";

const app = new PIXI.Application({
  background: '#74bbde',
  width:600,
  height:600,
  transparent: false,
  antialias: true,
});

globalThis.__PIXI_APP__ = app;

app.renderer.view.style.position = 'absolute';
document.body.appendChild(app.view);

const renderer = new GameRenderer(app);
const gameManager = new GameManager(app, renderer);

gameManager.start()