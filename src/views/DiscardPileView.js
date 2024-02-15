import { CardView } from './CardView';

export class DiscardPileView {
  constructor(scene, position) {
    this.scene = scene;
    this.position = position;
    this.topCardView = null;
    this.scale = 0.3;
    this.position = position;
    this.discardPile = [];
  }

  updateDiscardPile(gameState) {
    const { discardPile } = gameState;
    if (this.discardPile.length === discardPile.length) return;
    this.discardPile = discardPile;

    const topCardData = discardPile[discardPile.length - 1];
    this.topCardView = new CardView(this.scene, topCardData);

    const offsetX = Math.floor(Math.random() * 21) - 10;
    const offsetY = Math.floor(Math.random() * 21) - 10;
    this.topCardView.setPosition(
      this.position.x + offsetX,
      this.position.y + offsetY
    );

    const displayAngle = Math.floor(Math.random() * 41) - 20;
    this.topCardView.setRotation(displayAngle);
  }
}
