import FpsText from '../objects/fpsText';
import { Sprites } from '../objects/Sprites';

import { EnemyGroup, Sprite } from '../types';
import { twoDecimalFormat } from '../utils';
import { Group, GroupCreateConfig } from '../types/phaser';

export default class MainScene extends Phaser.Scene {
  fpsText: FpsText;
  screenWidth: number;
  screenHeigth: number;

  // Sprites
  player: Sprite;
  treasure: Sprite;
  enemiesGroup: Group;

  // config Values
  playerSpeed: number = 3;
  enemySpeed = {
    min: 1,
    max: 4,
  };
  enemyRange = {
    minY: 0,
    maxY: 0,
  };
  releasedButton: boolean = false;
  endGame: boolean = false;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.add.sprite(0, 0, Sprites.Background).setOrigin(0, 0).setDepth(0);

    this.fpsText = new FpsText(this).setDepth(100);
    this.screenWidth = this.sys.game.config.width as number;
    this.screenHeigth = this.sys.game.config.height as number;

    this.createPlayer();

    this.enemyRange.minY = this.screenHeigth / 5;
    this.enemyRange.maxY = this.screenHeigth / 1.3;

    this.enemiesGroup = this.add.group({
      key: 'enemy',
      repeat: 4,
      setXY: {
        x: 100,
        y: this.enemyRange.minY,
        stepX: 100,
        stepY: (this.enemyRange.maxY - this.enemyRange.minY) / 5,
      },
    } as GroupCreateConfig);

    Phaser.Actions.ScaleXY(this.enemiesGroup.getChildren(), -0.5);
    Phaser.Actions.Call(
      this.enemiesGroup.getChildren(),
      (enemy: EnemyGroup) => {
        const direction = Math.random() < 0.5 ? 1 : -1;
        const speed = this.enemySpeed.min + Math.random() * (this.enemySpeed.max - this.enemySpeed.min);

        enemy.flipX = true;
        enemy.speed = twoDecimalFormat(speed) * direction;
      },
      this,
    );

    this.treasure = this.add.sprite(this.screenWidth - 80, this.screenHeigth / 2, Sprites.Treasure).setScale(0.5);
    this.endGame = false;
  }

  private createPlayer() {
    this.player = this.add.sprite(50, this.screenHeigth / 2, Sprites.Player);
    this.player.setScale(0.5).setDepth(1);
  }

  update() {
    this.fpsText.update();
    console.info(this.endGame);
    if (this.endGame) {
      return;
    }

    this.checkInputs();
    this.moveEnemies();
    this.checkWinCondition();
  }

  private moveEnemies(): void {
    const enemies: EnemyGroup[] = this.enemiesGroup.getChildren();
    const playerCollider = this.player.getBounds();
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].y += enemies[i].speed;
      const enemyCollider = enemies[i].getBounds();

      if (Phaser.Geom.Intersects.RectangleToRectangle(playerCollider, enemyCollider)) {
        return this.gameOver();
      }

      const conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyRange.minY;
      const conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyRange.maxY;

      if (conditionDown || conditionUp) {
        enemies[i].speed *= -1;
      }
    }
  }

  private checkInputs(): void {
    if (this.input.activePointer.isDown && this.releasedButton) {
      this.player.x += this.playerSpeed;
    } else if (!this.input.activePointer.isDown) {
      this.releasedButton = true;
    }
  }

  private checkWinCondition(): void {
    const playerCollider = this.player.getBounds();
    const treasureCollider = this.treasure.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerCollider, treasureCollider)) {
      this.gameWin();
    }
  }

  private gameOver(): void {
    this.endGame = true;

    this.cameras.main.shake(400);
    this.cameras.main.on('camerashakecomplete', () => {
      this.cameras.main.fade(400);
    });

    this.cameras.main.on('camerafadeoutcomplete', () => {
      this.releasedButton = false;
      this.scene.restart();
    });
  }

  private gameWin(): void {
    this.releasedButton = false;
    this.scene.start('WinScene');
    this.scene.pause();
  }
}
