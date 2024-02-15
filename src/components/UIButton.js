import { UIText } from './UIText';

export class UIButton {
  constructor(scene, text) {
    this.scene = scene;
    this.rect = scene.add
      .rectangle(0, 0, 150, 60)
      .setStrokeStyle(1, 0xffffff)
      .setInteractive();
    this.text = new UIText(scene, text);
  }

  setLoc(x, y) {
    this.rect.x = x;
    this.rect.y = y;

    Phaser.Display.Align.In.Center(this.text.getGameObject(), this.rect);
  }

  onClick(callback) {
    this.rect.on('pointerdown', callback);
  }

  getRect() {
    return this.rect;
  }
}
