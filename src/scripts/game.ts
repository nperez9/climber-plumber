import 'phaser';
import MainScene from './scenes/mainScene';
import PreloadScene from './scenes/preloadScene';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './config';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#111',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 400 },
    },
  },
};

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
});
