import { PlayerAnim, playerFrames } from '../constants/PlayerAnimation';
import { Sprites } from '../constants/Sprites';
import FpsText from '../objects/fpsText';
import { Cursors, Group, SpriteWithDynamicBody } from '../types';

export default class MainScene extends Phaser.Scene {
  private fpsText: FpsText;
  private screenWidth: number;
  private screenHeigth: number;

  private player: SpriteWithDynamicBody;
  public velocity: number = 100;
  public jumpForce: number = 500;

  private platforms: Group;
  private cursors: Cursors;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.fpsText = new FpsText(this).setDepth(100);
    this.screenWidth = this.sys.game.config.width as number;
    this.screenHeigth = this.sys.game.config.height as number;

    this.physics.world.bounds.width = this.screenWidth;
    this.physics.world.bounds.height = this.screenHeigth;

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
    this.anims.create({
      key: PlayerAnim.Walk,
      frames: this.anims.generateFrameNames(Sprites.Player, {
        // pick the anim frames
        frames: playerFrames.walk,
      }),
      // yoyo = repeat (why this confusing name?)
      frameRate: 12,
      yoyo: true,
      repeat: -1,
    });
    this.player.body.setCollideWorldBounds(true);

    // colliders
    this.physics.add.collider(this.platforms, this.player);

    // cursors
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.fpsText.update();
    this.movePlayer();
  }

  private movePlayer() {
    const isOnGround = this.player.body.blocked.down || this.player.body.touching.down;

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-this.velocity);
      this.player.flipX = false;
      if (!this.player.anims.isPlaying) {
        this.player.anims.play(PlayerAnim.Walk);
      }
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(this.velocity);
      this.player.flipX = true;
      if (!this.player.anims.isPlaying) {
        this.player.anims.play(PlayerAnim.Walk);
      }
    } else {
      this.player.body.setVelocityX(0);
      //@ts-ignore
      this.player.anims.stop(PlayerAnim.Walk);
      this.player.setFrame(playerFrames.idle);
    }

    // jumping
    if ((this.cursors.space.isDown || this.cursors.up.isDown) && isOnGround) {
      this.player.body.setVelocityY(-this.jumpForce);
    }

    if (!isOnGround) {
      this.player.anims.stop();
      this.player.setFrame(playerFrames.jump);
    }
  }
}
