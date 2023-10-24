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
  private endgame: boolean = false;

  private player: SpriteWithDynamicBody;
  public velocity: number = 150;
  public jumpForce: number = 600;

  private goal;
  private platforms: Group;
  private fires: Group;
  private barrels: Group;
  private cursors: Cursors;
  private levelData: LevelData;

  constructor() {
    super({ key: 'MainScene' });
  }

  private setupLevel(): void {
    this.add.sprite(0, 0, Sprites.Backgorund).setOrigin(0);

    this.platforms = this.physics.add.staticGroup(); // better perforamnce
    this.levelData.platforms.map(({ x, y, key, numTiles }) => {
      let plaform;
      if (numTiles > 1) {
        // other way in case of constant sizes
        // const { width, height } = TILES_SIZE[key];
        const { width, height } = getSpriteDimension(this, key);
        plaform = this.add.tileSprite(x, y, numTiles * width, height, key);
      } else {
        plaform = this.add.sprite(x, y, key);
      }
      plaform.setOrigin(0, 0);
      this.physics.add.existing(plaform, true);
      this.platforms.add(plaform);
    });
  }

  private setupFireEnemies(): void {
    this.fires = this.physics.add.group({
      allowGravity: false,
      immovable: false,
    });
    this.levelData.fireEnemies.map(({ x, y }) => {
      const fire = this.add.sprite(x, y, Sprites.Fire).setOrigin(0, 1);
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
    this.goal = this.physics.add.sprite(goalPos.x, goalPos.y, Sprites.Gorilla).setOrigin(0, 1);
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

  private setupSpawner(): void {
    this.barrels = this.physics.add.group({
      bounceY: 0.1,
      bounceX: 1,
      collideWorldBounds: true,
    });

    const { spawner } = this.levelData;
    const spawnEvent = this.time.addEvent({
      delay: spawner.interval,
      loop: true,
      callbackScope: this,
      callback: () => {
        const barrel = this.barrels.create(this.goal.x, this.goal.y, Sprites.Barrel).setOrigin(1, 1);
        barrel.setVelocityX(spawner.speed);

        this.time.addEvent({
          delay: spawner.lifespan,
          repeat: 0,
          callbackScope: this,
          callback: () => {
            barrel.destroy();
          },
        });
      },
    });
  }

  create() {
    this.fpsText = new FpsText(this).setDepth(100);
    this.levelData = this.cache.json.get(LEVELS.One);
    this.screenWidth = this.levelData.world.width;
    this.screenHeigth = this.levelData.world.height;

    this.physics.world.bounds.width = this.screenWidth;
    this.physics.world.bounds.height = this.screenHeigth;

    this.setupLevel();
    this.setupFireEnemies();
    this.setupPlayer();
    this.setupCursor();
    this.setupSpawner();

    this.cameras.main.setBounds(0, 0, this.screenWidth, this.screenHeigth);
    this.cameras.main.startFollow(this.player);

    this.endgame = false;
    this.physics.add.collider(this.platforms, [this.player, this.goal, this.barrels]);
    this.physics.add.overlap(this.player, [this.fires, this.goal], this.restartGame, null, this);
  }

  update() {
    if (this.endgame) {
      this.stopMan();
      return;
    }
    this.fpsText.update();
    this.movePlayer();
  }

  private restartGame(sourceSprite, targetSprite): void {
    this.cameras.main.fade(500);
    this.endgame = true;
    this.cameras.main.on('camerafadeoutcomplete', () => {
      this.scene.restart();
    });
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
      this.stopMan();
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

  private stopMan() {
    this.player.body.setVelocityX(0);
    //@ts-ignore
    this.player.anims.stop(PlayerAnim.Walk);
    this.player.setFrame(playerFrames.idle);
  }
}
