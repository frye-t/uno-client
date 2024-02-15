import { Scene } from 'phaser';

class Card {
  constructor(depth) {
    this.depth = depth;
  }

  setDepth(depth) {
    this.depth = depth;
  }
}

class Opponent {
  constructor(id, area, location, game) {
    this.id = id;
    this.area = area;
    this.location = location;
    this.game = game;
    this.hand = [];
  }

  getId() {
    return this.id;
  }

  addToHand() {}

  setHand(hand) {
    console.log('Setting hand:', hand);
    this.hand = hand;
    this.adjustCardDisplay();
  }

  adjustCardDisplay() {
    this.hand.forEach((card) => {
      if (this.location === 'left') {
        card.setOrigin(1, 0.5);
        card.angle = 90;
      } else if (this.location === 'top') {
        card.setOrigin(1, 0.5);
        card.angle = 180;
      } else if (this.location === 'right') {
        card.setOrigin(1, 0.5);
        card.angle = -90;
      }
    });
  }

  render() {
    this.game.renderCards(this.hand, this.area, this.location);
  }
}

export class Game extends Scene {
  constructor() {
    super('Game_old');
  }

  init(data) {
    this.socket = data.socket;
    this.isHost = data.isHost;

    this.socket.emit('gameLoaded');

    this.playerId;
    this.hand = [];
    this.discardPile = [];
    this.activeColor;
    this.activeNumber;

    this.discardPileLength = 0;

    this.bottomPlayerCards = [];
    this.bottomPlayerArea = this.add
      .rectangle(640, 620, 700, 32)
      .setStrokeStyle(2, 0xffffff);

    this.opponentPlayerAreas = [];
    this.locations = ['left', 'top', 'right'];

    this.opponents = [];

    this.leftPlayerArea = this.add
      .rectangle(240, 360, 32, 350)
      .setStrokeStyle(2, 0xffffff);

    this.topPlayerArea = this.add
      .rectangle(640, 100, 350, 32)
      .setStrokeStyle(2, 0xffffff);

    this.rightPlayerArea = this.add
      .rectangle(1040, 360, 32, 350)
      .setStrokeStyle(2, 0xffffff);

    this.opponentPlayerAreas.push(this.leftPlayerArea);
    this.opponentPlayerAreas.push(this.topPlayerArea);
    this.opponentPlayerAreas.push(this.rightPlayerArea);

    this.leftPlayerCards = [];
    this.topPlayerCards = [];
    this.rightPlayerCards = [];

    this.cardScale = 0.3;
    this.discardAreaRect = this.add
      .rectangle(640, 360, 388 * this.cardScale, 562 * this.cardScale)
      .setStrokeStyle(1, 0xffffff);

    this.socket.on('informPlayerId', (data) => {
      const { playerId } = data;
      this.playerId = playerId;
    });

    this.socket.on('allPlayersLoaded', (data) => {
      console.log('Got playerData', data);

      this.numberOfPlayers = data.length;
      console.log('There are', this.numberOfPlayers, 'players in this game');

      for (let i = 1; i < this.numberOfPlayers; i++) {
        const opponentId = ((this.playerId - 1 + i) % this.numberOfPlayers) + 1;
        const opponent = new Opponent(
          opponentId,
          this.opponentPlayerAreas[i - 1],
          this.locations[i - 1],
          this
        );

        this.opponents.push(opponent);
      }

      if (this.isHost) {
        this.socket.emit('startGame');
      }
    });
  }

  renderCards(cards, area, location) {
    console.log(cards);
    console.log(area);
    console.log(location);
    const baseOffset = 50;
    let offset = baseOffset;

    // Determine whether the alignment is horizontal or vertical
    const isHorizontal = location === 'top' || location === 'bottom';
    const areaDimension = isHorizontal ? area.width : area.height;
    const cardDimension = cards[0].displayWidth;

    // Calculate total hand width by adding the width times
    // the number of offsets to the width of one card
    const totalInitialHandWidth = cardDimension + (cards.length - 1) * offset;

    // Adjust offset by dividing excess width by the number of offsets
    // and subtracting that from the base offset
    if (totalInitialHandWidth > areaDimension) {
      const excessWidth = totalInitialHandWidth - areaDimension;
      offset -= excessWidth / (cards.length - 1);
    }

    // Calculate starting position by dividing the totalHandWidth by 2 and subtracting
    // that from the playable area
    const totalHandWidth = cardDimension + (cards.length - 1) * offset;

    let cardPositionX, cardPositionY;
    let offsetX = 0,
      offsetY = 0;

    if (isHorizontal) {
      cardPositionX =
        location === 'top'
          ? area.x - totalHandWidth / 2
          : area.x + totalHandWidth / 2;
      cardPositionY = area.y;
      offsetX = location === 'bottom' ? -offset : offset;
    } else {
      // Vertical layout
      // Set starting position and offset appropriately for orientation and growth direction
      cardPositionX = area.x;
      cardPositionY =
        location === 'right'
          ? area.y - totalHandWidth / 2
          : area.y + totalHandWidth / 2;
      // Set offsetY to negative value if on left side
      offsetY = location === 'left' ? -offset : offset;
    }

    // Position each card
    cards.forEach((card) => {
      card.x = cardPositionX;
      card.y = cardPositionY;

      cardPositionX += offsetX;
      cardPositionY += offsetY;
    });
  }

  create() {
    const cardNames = [
      'blue_0',
      'blue_1',
      'blue_2',
      'blue_3',
      'blue_4',
      'blue_5',
      'blue_6',
      'blue_7',
      'blue_8',
      'blue_9',
      'green_0',
      'green_1',
      'green_2',
      'green_3',
      'green_4',
      'green_5',
      'green_6',
      'green_7',
      'green_8',
      'green_9',
      'yellow_0',
      'yellow_1',
      'yellow_2',
      'yellow_3',
      'yellow_4',
      'yellow_5',
      'yellow_6',
      'yellow_7',
      'yellow_8',
      'yellow_9',
      'red_0',
      'red_1',
      'red_2',
      'red_3',
      'red_4',
      'red_5',
      'red_6',
      'red_7',
      'red_8',
      'red_9',
      'blue_draw',
      'blue_reverse',
      'blue_skip',
      'green_draw',
      'green_reverse',
      'green_skip',
      'yellow_draw',
      'yellow_reverse',
      'yellow_skip',
      'red_draw',
      'red_reverse',
      'red_skip',
      'wild',
      'wild_draw',
    ];

    const cardScale = 0.3;

    this.cameras.main.setBackgroundColor(0x00ff00);

    this.add.image(640, 360, 'background').setAlpha(1);

    // this.add.rectangle(640, 550, 468, 32).setStrokeStyle(2, 0xffffff);
    const topPlayerArea = this.add
      .rectangle(640, 100, 350, 32)
      .setStrokeStyle(2, 0xffffff);

    const bottomPlayerArea = this.add
      .rectangle(640, 620, 700, 32)
      .setStrokeStyle(2, 0xffffff);

    const rightPlayerArea = this.add
      .rectangle(1040, 360, 32, 350)
      .setStrokeStyle(2, 0xffffff);

    const leftPlayerArea = this.add
      .rectangle(240, 360, 32, 350)
      .setStrokeStyle(2, 0xffffff);

    const addCardRect = this.add
      .rectangle(100, 50, 100, 40)
      .setStrokeStyle(1, 0xffffff)
      .setInteractive();

    const removeCardRect = this.add
      .rectangle(250, 50, 100, 40)
      .setStrokeStyle(1, 0xffffff)
      .setInteractive();

    const addCardToDiscardRect = this.add
      .rectangle(400, 50, 100, 40)
      .setStrokeStyle(1, 0xffffff)
      .setInteractive();

    const discardAreaRect = this.add
      .rectangle(640, 360, 388 * cardScale, 562 * cardScale)
      .setStrokeStyle(1, 0xffffff);

    const addCardText = this.add.text(0, 0, 'Add', {
      fontFamily: 'Sans',
      fontSize: 20,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
    });

    const removeCardText = this.add.text(0, 0, 'Remove', {
      fontFamily: 'Sans',
      fontSize: 20,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
    });

    const addCardToDiscardAreaText = this.add.text(0, 0, 'Add to Discard', {
      fontFamily: 'Sans',
      fontSize: 20,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
    });

    Phaser.Display.Align.In.Center(addCardText, addCardRect);
    Phaser.Display.Align.In.Center(removeCardText, removeCardRect);
    Phaser.Display.Align.In.Center(
      addCardToDiscardAreaText,
      addCardToDiscardRect
    );

    addCardToDiscardRect.on('pointerdown', () => {
      console.log('Add to discard');
      const idx = Math.floor(Math.random() * cardNames.length);
      const cardName = cardNames[idx];
      const displayAngle = Math.floor(Math.random() * 41) - 20;
      const offsetX = Math.floor(Math.random() * 21) - 10;
      const offsetY = Math.floor(Math.random() * 21) - 10;
      console.log('OSX:', offsetX);
      console.log('OSY:', offsetY);
      console.log('Angle:', displayAngle);
      const card = this.add
        .image(
          discardAreaRect.x + offsetX,
          discardAreaRect.y + offsetY,
          cardName
        )
        .setScale(cardScale);
      card.angle = displayAngle;
    });

    addCardRect.on('pointerdown', () => {
      const topCard = this.add
        .image(-100, -100, 'card_back')
        .setScale(cardScale);
      topCard.setOrigin(1, 0.5);
      topCard.angle = 180;
      topPlayerCards.push(topCard);
      this.renderCards(topPlayerCards, topPlayerArea, 'top');

      const idx = Math.floor(Math.random() * cardNames.length);
      const cardName = cardNames[idx];
      const bottomCard = this.add
        .image(-100, -100, cardName)
        .setScale(cardScale)
        .setDepth(bottomPlayerCards.length)
        .setInteractive();

      const originalY = bottomPlayerArea.y;
      const originalDepth = bottomCard.depth;
      bottomCard.on('pointerover', () => {
        console.log('Moused over a card');
        this.tweens.add({
          targets: bottomCard,
          y: originalY - 50, // Move up by 50 pixels
          duration: 200,
          ease: 'Power2',
        });
      });

      bottomCard.on('pointerout', () => {
        this.tweens.add({
          targets: bottomCard,
          y: originalY,
          duration: 200, // Duration of the animation in milliseconds
          ease: 'Power2',
        });
        bottomCard.setDepth(originalDepth);
      });

      bottomCard.on('pointerdown', () => {
        // Handle play card
      });
      bottomCard.setOrigin(1, 0.5);
      bottomPlayerCards.push(bottomCard);
      this.renderCards(bottomPlayerCards, bottomPlayerArea, 'bottom');

      const rightCard = this.add
        .image(-100, -100, 'card_back')
        .setScale(cardScale);
      rightCard.setOrigin(1, 0.5);
      rightCard.angle = -90;
      rightPlayerCards.push(rightCard);
      this.renderCards(rightPlayerCards, rightPlayerArea, 'right');

      const leftCard = this.add
        .image(-100, -100, 'card_back')
        .setScale(cardScale);
      leftCard.setOrigin(1, 0.5);
      leftCard.angle = 90;
      leftPlayerCards.push(leftCard);
      this.renderCards(leftPlayerCards, leftPlayerArea, 'left');
    });

    removeCardRect.on('pointerdown', () => {
      if (topPlayerCards.length <= 0) {
        return;
      }
      const removedTopCard = topPlayerCards.shift();
      removedTopCard.destroy();
      if (topPlayerCards.length > 0) {
        this.renderCards(topPlayerCards, topPlayerArea, 'top');
      }

      if (bottomPlayerCards.length <= 0) {
        return;
      }
      const removedBottomCard = bottomPlayerCards.shift();
      removedBottomCard.destroy();
      if (bottomPlayerCards.length > 0) {
        this.renderCards(bottomPlayerCards, bottomPlayerArea, 'bottom');
      }

      if (rightPlayerCards.length <= 0) {
        return;
      }
      const removedRightCard = rightPlayerCards.shift();
      removedRightCard.destroy();
      if (rightPlayerCards.length > 0) {
        this.renderCards(rightPlayerCards, rightPlayerArea, 'right');
      }

      if (leftPlayerCards.length <= 0) {
        return;
      }
      const removedLeftCard = leftPlayerCards.shift();
      removedLeftCard.destroy();
      if (leftPlayerCards.length > 0) {
        this.renderCards(leftPlayerCards, leftPlayerArea, 'left');
      }
    });

    console.log(topPlayerArea);
    console.log(topPlayerArea.x);

    const topPlayerCards = [];
    const bottomPlayerCards = [];
    const rightPlayerCards = [];
    const leftPlayerCards = [];

    for (let i = 0; i < 0; i++) {
      const img = this.add.image(-100, -100, 'card_back').setScale(cardScale);
      topPlayerCards.push(img);
    }

    this.input.once('pointerdown', () => {
      //   this.scene.start('GameOver');
    });

    this.socket.on('gameState', (data) => {
      const gameState = JSON.parse(data);
      console.log('Received Game State', gameState);
      let hand;

      let playerId;
      for (const player of gameState.players) {
        console.log(player.hand);
        if (player.hand) {
          playerId = player.id;
          hand = player.hand;
        }
      }

      if (gameState.discardPile) {
        this.discardPile = gameState.discardPile;
      }

      this.hand = hand;

      this.activeColor = gameState.activeColor;
      this.activeNumber = gameState.activeNumber;

      this.bottomPlayerCards;

      this.hand.forEach((card) => {
        // console.log('A card:', card);
        const cardName = card.suit.concat('_', card.rank).toLowerCase();
        // console.log(cardName);
        const cardImg = this.add
          .image(0, 0, cardName)
          .setScale(cardScale)
          .setInteractive();

        cardImg.setOrigin(1, 0.5);
        this.bottomPlayerCards.push(cardImg);
      });

      // Display other players hands
      for (let i = 1; i < this.numberOfPlayers; i++) {
        const opponentId = ((playerId - 1 + i) % this.numberOfPlayers) + 1;
        const opponentData = gameState.players.filter(
          (o) => o.id == opponentId
        )[0];
        const oData = gameState.players.filter(
          (o) => parseInt(o.id, 10) === opponentId
        );
        console.log('Searching for opponent with ID of:', opponentId);
        console.log(opponentData);
        console.log(oData);
        const opponent = this.opponents.filter(
          (o) => o.getId() === opponentId
        )[0];
        console.log('Opponents:', this.opponents);
        console.log('Found opponent:', opponent);
        const opponentCardCount = opponentData.cardCount;

        const tempHand = [];
        for (let i = 0; i < opponentCardCount; i++) {
          const card = this.add
            .image(-100, -100, 'card_back')
            .setScale(cardScale);
          console.log(card);
          tempHand.push(card);
        }
        console.log('TEMPHAND:', tempHand);
        opponent.setHand(tempHand);
        opponent.render();
      }

      if (this.discardPileLength < this.discardPile.length) {
        this.updateDiscardPile();
      }

      this.renderCards(this.bottomPlayerCards, this.bottomPlayerArea, 'bottom');
    });
  }

  updateDiscardPile(discardPile) {
    const discardCard = this.discardPile[this.discardPile.length - 1];
    const discardCardName = discardCard.suit
      .concat('_', discardCard.rank)
      .toLowerCase();
    const displayAngle = Math.floor(Math.random() * 41) - 20;
    const offsetX = Math.floor(Math.random() * 21) - 10;
    const offsetY = Math.floor(Math.random() * 21) - 10;

    const card = this.add
      .image(
        this.discardAreaRect.x + offsetX,
        this.discardAreaRect.y + offsetY,
        discardCardName
      )
      .setScale(this.cardScale);
    card.angle = displayAngle;
  }
}
