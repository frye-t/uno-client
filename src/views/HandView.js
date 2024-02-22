import { CardView } from './CardView';

export class HandView {
  constructor(scene, displayParam, isSelf) {
    this.scene = scene;
    this.displayParam = displayParam;
    this.isSelf = isSelf;

    this.width = 350;
    this.height = 32;

    this.playArea = this.createPlayArea();

    this.cardScale = 0.3;
    this.cardViews = [];
  }

  disableInteractive() {
    this.cardViews.forEach((cardView) => {
      cardView.disableInteractive();
    });
  }

  enableInteractive() {
    this.cardViews.forEach((cardView) => {
      cardView.enableInteractive();
    });
  }

  createPlayArea() {
    const playArea = this.scene.add.container(
      this.displayParam.x,
      this.displayParam.y
    );
    playArea.setSize(this.width, this.height);
    playArea.rotation = Phaser.Math.DegToRad(this.displayParam.rotation);

    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, 0xfffffff, 1);
    graphics.strokeRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    playArea.add(graphics);

    const topIndicator = this.scene.add.graphics();
    topIndicator.lineStyle(2, 0xffffff, 1);
    topIndicator.strokeRect(-5, -this.height / 2, 5, 5);
    playArea.add(topIndicator);

    return playArea;
  }

  updateHand(handData, isSelf) {
    console.log('Updating HandView');
    console.log(this.cardViews);
    this.cardViews.forEach((card) => card.destroy());
    this.cardViews = [];

    handData.cards.forEach((cardData) => {
      const cardView = new CardView(
        this.scene,
        cardData,
        this.cardScale,
        isSelf
      );
      this.playArea.add(cardView.getImage());
      this.cardViews.push(cardView);
    });
    console.log('End updating hand, rendering');
    console.log(this.cardViews);
    this.renderCards();
  }

  renderCards() {
    if (this.cardViews.length === 0) return;

    const baseOffset = 50;
    let offset = baseOffset;

    const cardWidth = this.cardViews[0].displayWidth() * this.cardScale;
    const cardCount = this.cardViews.length;

    let totalWidth = cardWidth * cardCount + (cardCount - 1) * offset;

    // Adjust offset if necessary to keep cards within play area
    if (totalWidth > this.playArea.width) {
      const excessWidth = totalWidth - this.playArea.width;
      offset -= excessWidth / (cardCount - 1);
    }

    totalWidth = cardWidth * cardCount + (cardCount - 1) * offset;

    let startX = -totalWidth / 2 + cardWidth / 2;

    this.cardViews.forEach((cardView, index) => {
      const x = startX + (cardWidth + offset) * index;
      const y = 0;
      cardView.setPosition(x, y);

      if (this.isSelf) {
        cardView.setInteractive();
      }
    });

    console.log('Done rendering:', this.cardViews);
  }
}
