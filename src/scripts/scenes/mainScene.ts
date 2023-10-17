import { Sprites } from '../objects/Sprites';
import FpsText from '../objects/fpsText';
import { SpriteWithDynamicBody } from '../types';

export default class MainScene extends Phaser.Scene {
  fpsText: FpsText;
  screenWidth: number;
  screenHeigth: number;

  private ground: SpriteWithDynamicBody;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.fpsText = new FpsText(this).setDepth(100);
    this.screenWidth = this.sys.game.config.width as number;
    this.screenHeigth = this.sys.game.config.height as number;

    // Ground Config
    const ground = this.add.sprite(0, 604, Sprites.Ground).setOrigin(0, 0.5);
    this.physics.add.existing(ground, true);
    // this.ground.body.allowGravity = false;
    // this.ground.body.immovable = false;

    //const ground2 = this.physics.add.sprite(180, 200, Sprites.Ground);

    // this.physics.add.collider(this.ground, ground2);
    console.info(this.ground);
  }

  update() {
    this.fpsText.update();
  }
}
