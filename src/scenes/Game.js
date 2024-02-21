import { Scene } from 'phaser';
import { GameState } from '../models/GameState';
import { PlayerGameView } from '../views/PlayerGameView';
import { DiscardPileView } from '../views/DiscardPileView';
import { UINotification } from '../components/UINotification';
import { EventDispatcher } from '../utils/EventDispatcher';
import { UIText } from '../components/UIText';
import { UIButton } from '../components/UIButton';

export class Game extends Scene {
  constructor() {
    super('Game');
    this.emitter = EventDispatcher.getInstance();
    this.isTurn = false;

    this.emitter.on('CARD_SELECTED', this.handleCardSelection.bind(this));
  }

  init(data) {
    this.isHost = data.isHost;
    this.socketController = data.socketController;
    this.playerController = data.playerController;

    this.gameState = new GameState();

    console.log('Socket Controller:', this.socketController);

    this.displayParams = [
      { x: 640, y: 600, rotation: 0 },
      { x: 240, y: 360, rotation: 90 },
      { x: 640, y: 100, rotation: 180 },
      { x: 1040, y: 360, rotation: 270 },
    ];

    this.playerView = new PlayerGameView(
      this,
      this.displayParams,
      this.playerController.getPlayerCount()
    );
    this.playerController.setView(this.playerView);

    this.bindSocketEventCallbacks();

    this.discardPileView = new DiscardPileView(this, { x: 640, y: 360 });

    this.socketController.sendGameLoaded();
  }

  bindSocketEventCallbacks() {
    // Reactor these to be event listeners from the SocketController
    this.socketController.setCallbackForEvent('allPlayersLoaded', () => {
      if (this.isHost) {
        this.socketController.sendStartGame();
      }
    });

    this.socketController.setCallbackForEvent(
      'gameState',
      this.handleGameState.bind(this)
    );

    this.socketController.setCallbackForEvent('turnStart', () => {
      this.isTurn = true;
      new UINotification(this, "It's Your Turn!");
    });

    this.socketController.setCallbackForEvent('turnWaiting', () => {
      this.isTurn = false;
    });

    this.socketController.setCallbackForEvent('roundOver', (data) => {
      console.log('Got Round Over');
      const { playerId } = data;
      const text =
        playerId === this.playerController.getSelfId()
          ? 'You win!'
          : `${this.playerController.getPlayerNameById(playerId)} wins!`;
      const playerWinsText = new UIText(this, text, 50);
      playerWinsText.setLoc(0, 200);
      playerWinsText.centerHorizontally();
    });

    this.socketController.setCallbackForEvent('chooseColor', () => {
      const text = new UIText(this, 'Pick a color!', 40);
      // Need to hide top card
      this.renderChooseColorModal();
      // this.socketController.setCallbackForEvent('gameState', (data) => {
      //   this.handleGameState(data);
      // });
    });

    this.socketController.setCallbackForEvent('challenge', () => {
      console.log('Received a challenge event');
      this.renderChallengeModal();
    });
  }

  handleGameState(data) {
    const gameState = JSON.parse(data);
    this.gameState.update(gameState);
    this.playerController.updateGameState(gameState);

    // This won't work in the long run, but it works for now
    // Only want to update the Discard Pile if there's a new card there
    this.discardPileView.updateDiscardPile(gameState);
  }

  renderChallengeModal() {
    const modalObjects = [];

    const fader = this.add.image(640, 360, 'background').setAlpha(0.7);
    modalObjects.push(fader);

    this.graphics = this.add.graphics();

    const modalWidth = 600;
    const modalHeight = 300;

    this.graphics.fillStyle(0xeeeeee, 1);
    this.graphics.fillRoundedRect(
      640 - modalWidth / 2,
      360 - modalHeight / 2,
      modalWidth,
      modalHeight,
      10
    );

    this.graphics.lineStyle(2, 0x000000, 1);
    this.graphics.strokeRoundedRect(
      640 - modalWidth / 2,
      360 - modalHeight / 2,
      modalWidth,
      modalHeight,
      10
    );

    const pickText = new UIText(this, 'Do you want to Challenge?', 30);
    // Center Horizontally
    const x = 640 - pickText.width() / 2;
    // Place 30 pixels below top of modal
    const y = 360 - modalHeight / 2 + 30;
    pickText.setLoc(x, y);
    modalObjects.push(pickText);

    const yesBtn = new UIButton(this, 'Yes');
    const noBtn = new UIButton(this, 'No');
    modalObjects.push(yesBtn, noBtn);

    yesBtn.setBorderColor(0x000000);
    yesBtn.setTextColor(0x000000);

    noBtn.setBorderColor(0x000000);
    noBtn.setTextColor(0x000000);

    const modalSectionWidth = modalWidth / 2;
    yesBtn.setLoc(640 - modalSectionWidth / 2, 360);
    noBtn.setLoc(640 + modalSectionWidth / 2, 360);

    yesBtn.onClick(() => {
      this.socketController.sendHandleChallenge(true);
      this.modalReset(modalObjects);
    });

    noBtn.onClick(() => {
      this.socketController.sendHandleChallenge(false);
      this.modalReset(modalObjects);
    });
  }

  renderChooseColorModal() {
    console.log('Going to render modal');
    const modalObjects = [];

    const fader = this.add.image(640, 360, 'background').setAlpha(0.7);
    modalObjects.push(fader);

    this.graphics = this.add.graphics();

    const modalWidth = 600;
    const modalHeight = 300;

    this.graphics.fillStyle(0xeeeeee, 1);
    this.graphics.fillRoundedRect(
      640 - modalWidth / 2,
      360 - modalHeight / 2,
      modalWidth,
      modalHeight,
      10
    );

    this.graphics.lineStyle(2, 0x000000, 1);
    this.graphics.strokeRoundedRect(
      640 - modalWidth / 2,
      360 - modalHeight / 2,
      modalWidth,
      modalHeight,
      10
    );

    const pickText = new UIText(this, 'Pick a Color!', 30);
    // Center Horizontally
    const x = 640 - pickText.width() / 2;
    // Place 30 pixels below top of modal
    const y = 360 - modalHeight / 2 + 30;
    pickText.setLoc(x, y);
    modalObjects.push(pickText);

    const elipseWidth = 115;
    const elipseHeight = 144;

    const redEllipse = this.createModalEllipse(
      0,
      0xea323c,
      modalWidth,
      modalHeight
    );

    const greenEllipse = this.createModalEllipse(
      1,
      0x33984b,
      modalWidth,
      modalHeight
    );

    const yellowEllipse = this.createModalEllipse(
      2,
      0xffc825,
      modalWidth,
      modalHeight
    );

    const blueEllipse = this.createModalEllipse(
      3,
      0x0098dc,
      modalWidth,
      modalHeight
    );
    modalObjects.push(redEllipse, greenEllipse, yellowEllipse, blueEllipse);

    redEllipse.on('pointerdown', (d) => {
      console.log('Red Ellipse Clicked:', d);
      this.socketController.sendChooseColor('Red');
      this.modalReset(modalObjects);
    });

    greenEllipse.on('pointerdown', (d) => {
      console.log('Green Ellipse Clicked:', d);
      this.socketController.sendChooseColor('Green');
      this.modalReset(modalObjects);
    });

    yellowEllipse.on('pointerdown', (d) => {
      console.log('Yellow Ellipse Clicked:', d);
      this.socketController.sendChooseColor('Yellow');
      this.modalReset(modalObjects);
    });

    blueEllipse.on('pointerdown', (d) => {
      console.log('Blue Ellipse Clicked:', d);
      this.socketController.sendChooseColor('Blue');
      this.modalReset(modalObjects);
    });
  }

  modalReset(modalObjects) {
    modalObjects.forEach((o) => o.destroy());
    this.graphics.clear();
  }

  createModalEllipse(num, color, modalWidth, modalHeight) {
    const elipseWidth = 115;
    const elipseHeight = 144;
    const modalSectionWidth = modalWidth / 4;
    const x =
      640 - modalHeight + modalSectionWidth * num + modalSectionWidth / 2;

    const elipse = this.add.ellipse(
      x,
      360,
      elipseWidth,
      elipseHeight,
      color,
      1
    );
    elipse.setStrokeStyle(1, 0x000000);
    elipse.angle = 30;
    elipse.setInteractive();
    return elipse;
  }

  create() {
    this.cameras.main.setBackgroundColor(0x00ff00);

    this.add.image(640, 360, 'background').setAlpha(1);

    // Create the deck to pull from
    const deck = this.add
      .image(840, 360, 'deck_full')
      .setAlpha(1)
      .setScale(0.3);
    deck.setInteractive();
    deck.on('pointerdown', this.handleDrawCard.bind(this));
  }

  handleDrawCard() {
    if (this.isTurn) {
      console.log('Gonna try to draw a card now!');
      this.socketController.sendDrawCard();
    } else {
      console.log("Can't draw, it's not your turn!");
    }
  }

  handleCardSelection(cardData) {
    if (this.isTurn) {
      console.log('Trying to play:', cardData);
      // socket.emit('playCard', { id, suit: card.suit, rank: card.rank });
      const playerId = this.playerController.getSelfId();
      this.socketController.sendPlayCard(playerId, cardData);
    } else {
      console.log("It's not your turn!");
    }
  }
}
