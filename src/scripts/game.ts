import 'phaser';
import MainScene from './scenes/mainScene';
import PreloadScene from './scenes/preloadScene';
import WinScene from './scenes/winScene';

import { DEFAULT_HEIGHT, DEFAULT_WIDTH, isDev } from './config';

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
  scene: [PreloadScene, MainScene, WinScene],
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: isDev,
      gravity: { y: 1000 },
    },
  },
};

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
});
