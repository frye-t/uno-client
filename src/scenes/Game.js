import { Scene } from 'phaser';
import { GameState } from '../models/GameState';
import { PlayerGameView } from '../views/PlayerGameView';
import { DiscardPileView } from '../views/DiscardPileView';
import { UINotification } from '../components/UINotification';
import { EventDispatcher } from '../utils/EventDispatcher';

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
    this.socketController.setCallbackForEvent('allPlayersLoaded', () => {
      if (this.isHost) {
        this.socketController.sendStartGame();
      }
    });

    this.socketController.setCallbackForEvent('gameState', (data) => {
      const gameState = JSON.parse(data);
      this.gameState.update(gameState);
      this.playerController.updateGameState(gameState);

      // This won't work in the long run, but it works for now
      // Only want to update the Discard Pile if there's a new card there
      this.discardPileView.updateDiscardPile(gameState);
    });

    this.socketController.setCallbackForEvent('turnStart', () => {
      this.isTurn = true;
      new UINotification(this, "It's Your Turn!");
    });

    this.socketController.setCallbackForEvent('turnWaiting', () => {
      this.isTurn = false;
    });
  }

  create() {
    this.cameras.main.setBackgroundColor(0x00ff00);

    this.add.image(640, 360, 'background').setAlpha(1);
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
