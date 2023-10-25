export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinScene' });
  }

  private retryText;
  private cursors;

  create() {
    const screenHeigth = this.sys.game.config.height as number;
    const initialWidth = 10;
    const style = { color: '#FFF', fontSize: '28px', fontFamily: 'sans-serif' };

    this.add
      .text(initialWidth, screenHeigth / 2, 'You Won!!', style)
      .setDepth(1500)
      .setOrigin(0, 1);

    this.add
      .text(initialWidth, screenHeigth / 2 + 40, 'Thanks for playing', style)
      .setDepth(1500)
      .setOrigin(0, 1);

    this.retryText = this.add
      .text(initialWidth, screenHeigth / 2 + 100, 'Tap here to play again', { ...style, fontSize: '34px' })
      .setDepth(1500)
      .setOrigin(0, 1)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', this.startGame.bind(this))
      .on('pointerover', () => this.retryText.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => this.retryText.setStyle({ fill: '#FFF' }));

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time: number, delta: number): void {
    if (this.cursors.space.isDown) {
      this.startGame();
    }
  }

  private startGame() {
    this.scene.start('MainScene');
  }
}
