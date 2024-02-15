import { Scene } from 'phaser';
import { Hand } from '../components/Hand';
import { Card } from '../components/Card';
import { PlayerController } from '../controllers/PlayerController';
export class Game extends Scene {
  constructor() {
    super('Game');
    this.locations = {
      1: [{ x: 640, y: 600, rotation: 0 }],
      2: [
        { x: 640, y: 600, rotation: 0 },
        { x: 640, y: 100, rotation: 180 },
      ],
      3: [
        { x: 640, y: 600, rotation: 0 },
        { x: 370, y: 250, rotation: 120 },
        { x: 910, y: 250, rotation: 240 },
      ],
      4: [
        { x: 640, y: 600, rotation: 0 },
        { x: 240, y: 360, rotation: 90 },
        { x: 640, y: 100, rotation: 180 },
        { x: 1040, y: 360, rotation: 270 },
      ],
      5: [
        { x: 640, y: 600, rotation: 0 },
        { x: 180, y: 400, rotation: 72 },
        { x: 380, y: 200, rotation: 144 },
        { x: 900, y: 200, rotation: 216 },
        { x: 1100, y: 400, rotation: 288 },
      ],
      6: [
        { x: 640, y: 600, rotation: 0 },
        { x: 180, y: 500, rotation: 60 },
        { x: 180, y: 200, rotation: 120 },
        { x: 640, y: 100, rotation: 180 },
        { x: 1100, y: 200, rotation: 240 },
        { x: 1100, y: 500, rotation: 300 },
      ],
    };
  }

  init(data) {
    this.socket = data.socket;
    this.isHost = data.isHost;
    this.playerController = data.playerController;
    this.playerController.setScene(this);

    console.log('PLAYER CONTROLLER:', this.playerController);

    this.playerCount = 0;
    this.displayParams = [];
    this.hands = [];

    this.socket.emit('gameLoaded');
    this.socket.on('allPlayersLoaded', (data) => {
      const { playerCount } = data;
      this.playerCount = playerCount;
      this.displayParams = this.locations[playerCount];
      if (this.isHost) {
        this.socket.emit('startGame');
      }
    });

    this.bindSocketEvents();
  }

  bindSocketEvents() {
    this.socket.on('gameState', this.handleGameState.bind(this));
  }

  handleGameState(data) {
    const gameState = JSON.parse(data);
    const { turnOrder, players, discardPile } = gameState;
    // const { players } = gameState;
    console.log('Got a game state:', gameState);
    this.playerController.printPlayers();
    const selfId = this.playerController.getSelfId();
    const selfTurnIdx = turnOrder.indexOf(selfId);

    const tempHands = [];
    console.log(`There are ${this.playerController.getPlayerCount()} players`);
    for (let i = 0; i < this.playerCount; i++) {
      const playerTurnIdx =
        (selfTurnIdx + i) % this.playerController.getPlayerCount();
      const playerId = turnOrder[playerTurnIdx];

      // const player = this.playerController.getPlayerById(playerId);
      const player = players.filter((p) => p.id === playerId)[0];
      // const hand = new Hand(this, player.cardCount, player.hand);

      const cardCount = player.cardCount;
      const hand = player.hand;

      for (let i = 0; i < cardCount; i++) {
        let rank;
        let suit;
        if (hand) {
          rank = hand[i].rank;
          suit = hand[i].suit;
        }
        const card = new Card(this, 0.3, rank, suit);
        this.playerController.addCardToPlayerHandById(playerId, card);
      }

      // const card = new Card(this, 0.3, )
      // tempHands.push(hand);
      this.playerController.adjustPlayerPlayArea(
        playerId,
        this.displayParams[i]
      );
    }

    // this.playerController.adjustPlayAreas(turnOrder, this.displayParams);

    // this.hands = tempHands;
    // this.hands.forEach((hand, idx) => {
    //   hand.adjustPlayArea(
    //     this.displayParams[idx].x,
    //     this.displayParams[idx].y,
    //     this.displayParams[idx].rot
    //   );
    // });

    // Add discard card to the pile
    this.discardPile = discardPile;
    const discardCard = new Card(
      this,
      0.3,
      discardPile[0].rank,
      discardPile[0].suit
    );

    const displayAngle = Math.floor(Math.random() * 41) - 20;
    const offsetX = Math.floor(Math.random() * 21) - 10;
    const offsetY = Math.floor(Math.random() * 21) - 10;
    discardCard.setLoc(
      this.discardAreaRect.x + offsetX,
      this.discardAreaRect.y + offsetY,
      displayAngle
    );
  }

  create() {
    this.cardScale = 0.3;
    this.cameras.main.setBackgroundColor(0x00ff00);

    this.add.image(640, 360, 'background').setAlpha(1);

    this.discardAreaRect = this.add
      .rectangle(640, 360, 388 * this.cardScale, 562 * this.cardScale)
      .setStrokeStyle(1, 0xffffff);
  }

  renderAddCard() {
    const addCardRect = this.add
      .rectangle(100, 50, 100, 40)
      .setStrokeStyle(1, 0xffffff)
      .setInteractive();

    const addCardText = this.add.text(0, 0, 'Add', {
      fontFamily: 'Sans',
      fontSize: 20,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
    });

    Phaser.Display.Align.In.Center(addCardText, addCardRect);

    addCardRect.on('pointerdown', () => {
      this.hand.addCard();
    });
  }

  renderAddPlayer() {
    const addPlayerRect = this.add
      .rectangle(200, 50, 100, 40)
      .setStrokeStyle(1, 0xffffff)
      .setInteractive();

    const addPlayerText = this.add.text(0, 0, '+Player', {
      fontFamily: 'Sans',
      fontSize: 20,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
    });

    Phaser.Display.Align.In.Center(addPlayerText, addPlayerRect);

    addPlayerRect.on('pointerdown', () => {
      this.players += 1;
      const newHand = new Hand(this, 0, 0, 0);
      this.hands.push(newHand);

      const numHands = this.hands.length;
      const displayParams = this.locations[numHands];
      console.log('Params:', displayParams);
      this.hands.forEach((hand, idx) => {
        hand.adjustPlayArea(
          displayParams[idx].x,
          displayParams[idx].y,
          displayParams[idx].rot
        );
      });
    });
  }
}
