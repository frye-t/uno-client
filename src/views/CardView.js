import { EventDispatcher } from '../utils/EventDispatcher';

export class CardView {
  constructor(scene, cardData, isSelf) {
    this.scene = scene;
    this.cardData = cardData;
    this.scale = 0.3;
    this.image = this.createImage();

    this.emitter = EventDispatcher.getInstance();

    this.image.on('pointerdown', () => {
      this.emitter.emit('CARD_SELECTED', this.cardData);
    });
  }

  createImage() {
    const { rank, suit } = this.cardData;
    const cardImgString = `${suit.toLowerCase()}_${rank.toLowerCase()}`;
    const image = this.scene.add
      .image(0, 0, cardImgString)
      .setScale(this.scale);

    return image;
  }

  getImage() {
    return this.image;
  }

  setPosition(x, y) {
    this.image.x = x;
    this.image.y = y;
  }

  setRotation(angle) {
    this.image.angle = angle;
  }

  displayWidth() {
    return this.image.displayWidth;
  }

  destroy() {
    console.log('Destroying an image');
    this.image.destroy();
  }

  setInteractive() {
    this.image.setInteractive();
    const originalY = this.image.y;

    this.image.on('pointerover', () => {
      this.scene.tweens.add({
        targets: this.image,
        y: originalY - 50,
        duration: 200,
        ease: 'Power2',
      });
    });

    this.image.on('pointerout', () => {
      this.scene.tweens.add({
        targets: this.image,
        y: originalY,
        duration: 200, // Duration of the animation in milliseconds
        ease: 'Power2',
      });
    });

    this.image.on('click', () => {
      console.log('Clicked a card');
    });
  }
}
