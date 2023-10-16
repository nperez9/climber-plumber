export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinScene' });
  }

  create() {
    const screenHeigth = this.sys.game.config.height as number;

    this.add
      .text(200, screenHeigth / 2, 'You Won!!', { color: '#FFF', fontSize: '28px' })
      .setDepth(1500)
      .setOrigin(0, 1);

    this.add
      .text(200, screenHeigth / 2 + 40, 'Thanks for playing', { color: '#FFF', fontSize: '28px' })
      .setDepth(1500)
      .setOrigin(0, 1);
  }
}
