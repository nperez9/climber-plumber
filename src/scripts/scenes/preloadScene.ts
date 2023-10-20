import { LEVELS } from '../constants/Levels';
import { Sprites } from '../constants/Sprites';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image(Sprites.Barrel, 'assets/sprites/barrel.png');
    this.load.image(Sprites.Block, 'assets/sprites/block.png');
    this.load.image(Sprites.Gorilla, 'assets/sprites/gorilla.png');
    this.load.image(Sprites.Ground, 'assets/sprites/ground.png');
    this.load.image(Sprites.Platform, 'assets/sprites/platform.png');

    this.load.spritesheet(Sprites.Fire, 'assets/spritesheets/fire_spritesheet.png', {
      frameWidth: 20,
      frameHeight: 21,
      margin: 1,
      spacing: 1,
    });
    this.load.spritesheet(Sprites.Player, 'assets/spritesheets/player_spritesheet.png', {
      frameWidth: 28,
      frameHeight: 30,
      margin: 1,
      spacing: 1,
    });

    this.load.json(LEVELS.One, 'assets/levels/level1.json');
  }

  create() {
    this.scene.start('MainScene');
  }
}
