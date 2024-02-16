export class UIText {
  constructor(scene, text, fontSize = 20) {
    this.scene = scene;
    this.text = text;
    this.gameObject = scene.add.text(0, 0, text, {
      fontFamily: 'Sans',
      fontSize,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
    });
  }

  centerHorizontally() {
    this.gameObject.x = 640 - this.gameObject.displayWidth / 2;
  }

  getGameObject() {
    return this.gameObject;
  }

  setText(text) {
    this.gameObject.setText(text);
  }

  enableFadeOut(duration) {
    this.scene.tweens.add({
      targets: this.gameObject,
      alpha: 0,
      duration,
      ease: 'Phaser.Math.Easing.Cubic.Out',
      onComplete: () => this.gameObject.destroy(),
    });
  }

  anchorBelow(gameObject) {
    Phaser.Display.Align.To.BottomCenter(this.gameObject, gameObject);
  }

  setLoc(x, y) {
    this.gameObject.x = x;
    this.gameObject.y = y;
  }

  destroy() {
    this.gameObject.destroy();
  }
}
