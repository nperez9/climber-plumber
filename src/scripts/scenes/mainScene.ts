import { isDev } from '../config';
import { PlayerAnim, playerFrames, Sprites } from '../constants';
import { LEVELS } from '../constants/Levels';
import FpsText from '../objects/fpsText';
import { Cursors, Group, SpriteWithDynamicBody, LevelData } from '../types';
import { twoDecimalFormat, getSpriteDimension } from '../utils';

export default class MainScene extends Phaser.Scene {
  private fpsText: FpsText;
  private screenWidth: number;
  private screenHeigth: number;

  private player: SpriteWithDynamicBody;
  public velocity: number = 150;
  public jumpForce: number = 600;

  private goal;
  private platforms: Group;
  private fires: Group;
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

  private setupFireEnemies(): void {
    this.fires = this.add.group();
    this.levelData.fireEnemies.map(({ x, y }) => {
      const fire = this.physics.add.sprite(x, y, Sprites.Fire).setOrigin(0);
      fire.body.allowGravity = false;
      fire.body.immovable = true;
      fire.anims.play('burn');
      this.fires.add(fire);

      if (isDev) {
        fire.setInteractive();
        this.input.setDraggable(fire);
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
          gameObject.x = dragX;
          gameObject.y = dragY;

          console.log('Fire Drag', twoDecimalFormat(dragX), twoDecimalFormat(dragY));
        });
      }
    });
  }

  private setupPlayer(): void {
    const { x, y } = this.levelData.player;
    this.player = this.physics.add.sprite(x, y, Sprites.Player, 3);
    this.player.body.setCollideWorldBounds(true);

    const goalPos = this.levelData.goal;
    this.goal = this.physics.add.sprite(goalPos.x, goalPos.y, Sprites.Gorilla).setOrigin(0);
  }

  private setupCursor(): void {
    // cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // to get coordinates
    if (isDev) {
      this.input.on('pointerdown', (pointer) => {
        const { x, y } = pointer;
        console.info(twoDecimalFormat(x), twoDecimalFormat(y));
      });
    }
  }

  create() {
    this.fpsText = new FpsText(this).setDepth(100);
    this.screenWidth = this.sys.game.config.width as number;
    this.screenHeigth = this.sys.game.config.height as number;

    this.physics.world.bounds.width = this.screenWidth;
    this.physics.world.bounds.height = this.screenHeigth;
    this.add.sprite(0, 0, Sprites.Backgorund).setOrigin(0);

    this.setupLevel();
    this.setupFireEnemies();
    this.setupPlayer();
    this.setupCursor();

    this.physics.add.collider(this.platforms, this.player);
    this.physics.add.collider(this.platforms, this.goal);
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
