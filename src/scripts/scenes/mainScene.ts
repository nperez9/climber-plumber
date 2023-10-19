import { Sprites } from '../objects/Sprites';
import FpsText from '../objects/fpsText';
import { Group, SpriteWithDynamicBody } from '../types';

export default class MainScene extends Phaser.Scene {
  fpsText: FpsText;
  screenWidth: number;
  screenHeigth: number;

  private ground: SpriteWithDynamicBody;
  private player: SpriteWithDynamicBody;
  private platforms: Group;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.fpsText = new FpsText(this).setDepth(100);
    this.screenWidth = this.sys.game.config.width as number;
    this.screenHeigth = this.sys.game.config.height as number;

    this.platforms = this.add.group();

    // Ground Config
    const ground = this.add.sprite(0, 604, Sprites.Ground).setOrigin(0, 0.5);
    this.physics.add.existing(ground, true);
    this.platforms.add(ground);

    /**
     cool COde
     this.ground.body.allowGravity = false;
     this.ground.body.immovable = false;
     const ground2 = this.physics.add.sprite(180, 200, Sprites.Ground);
     this.physics.add.collider(this.ground, ground2);
    */

    const platform = this.add.tileSprite(180, 500, 4 * 36, 1 * 30, Sprites.Block);
    // static (without bool is kinematic)
    this.physics.add.existing(platform, true);
    this.platforms.add(platform);

    // Playerr
    this.player = this.physics.add.sprite(180, 300, Sprites.Player, 3);

    this.physics.add.collider(this.platforms, this.player);
  }

  update() {
    this.fpsText.update();
  }
}
