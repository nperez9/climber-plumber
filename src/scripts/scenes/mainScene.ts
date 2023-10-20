import { PlayerAnim, playerFrames, Sprites, TILES_SIZE } from '../constants';
import { LEVELS } from '../constants/Levels';
import FpsText from '../objects/fpsText';
import { Cursors, Group, SpriteWithDynamicBody } from '../types';
import { LevelData } from '../types/level';
import { getSpriteDimension } from '../utils/getSpriteDimensions';

export default class MainScene extends Phaser.Scene {
  private fpsText: FpsText;
  private screenWidth: number;
  private screenHeigth: number;

  private player: SpriteWithDynamicBody;
  public velocity: number = 150;
  public jumpForce: number = 600;

  private platforms: Group;
  private cursors: Cursors;
  private levelData: LevelData;

  constructor() {
    super({ key: 'MainScene' });
  }

  private setupLevel(): void {
    this.levelData = this.cache.json.get(LEVELS.One);
    this.platforms = this.add.group();

    this.levelData.platforms.map(({ x, y, key, numTiles }) => {
      let plaform;
      if (numTiles > 1) {
        // One Way
        // const { width, height } = TILES_SIZE[key];
        const { width, height } = getSpriteDimension(this, key);
        plaform = this.add.tileSprite(x, y, numTiles * width, height, key);
      } else {
        plaform = this.add.sprite(x, y, key);
      }
      plaform.setOrigin(0);
      this.physics.add.existing(plaform, true);
      this.platforms.add(plaform);
    });
  }

  private setupPlayer(): void {
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
  }

  private setupCursor(): void {
    // cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // to get coordinates
    this.input.on('pointerdown', (pointer) => {
      console.info(pointer.x, pointer.y);
    });
  }

  create() {
    this.fpsText = new FpsText(this).setDepth(100);
    this.screenWidth = this.sys.game.config.width as number;
    this.screenHeigth = this.sys.game.config.height as number;

    this.physics.world.bounds.width = this.screenWidth;
    this.physics.world.bounds.height = this.screenHeigth;

    this.setupLevel();
    this.setupPlayer();
    this.setupCursor();

    this.physics.add.collider(this.platforms, this.player);
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
