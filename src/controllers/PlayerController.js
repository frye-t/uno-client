import { Player } from '../models/Player';
import { Card } from '../models/Card';

export class PlayerController {
  constructor(playerView) {
    this.players = new Map();
    this.playerView = playerView;
    this.turnOrder;

    this.viewInitialized = false;
  }

  updateGameState(gameState) {
    this.turnOrder = gameState.turnOrder;

    gameState.players.forEach((playerState) => {
      const player = this.players.get(playerState.id);
      const cardCount = playerState.cardCount;
      const hand = playerState.hand;
      if (player) {
        player.clearHand();

        for (let i = 0; i < cardCount; i++) {
          let rank;
          let suit;
          if (hand) {
            rank = hand[i].rank;
            suit = hand[i].suit;
          }
          const card = new Card(rank, suit);
          player.addCardToHand(card);
        }
      }
    });

    if (!this.viewInitialized) {
      this.playerView.init(this.turnOrder, this.getSelfId());
      this.viewInitialized = true;
    }

    this.updateView();
  }

  updateView() {
    const players = Array.from(this.players.values());
    players.forEach((player) => {
      this.playerView.updateHandView(player.id, player.hand);
    });
  }

  addPlayer(id, name, isSelf = false, isHost) {
    const player = new Player(id, name, isSelf, isHost);
    console.log('Created a new player with isHost:', isHost, player);
    this.players.set(id, player);
    this.playerView.addPlayer(id, player.getName());
    console.log('Player', player);
    return player;
  }

  removePlayer(id) {
    if (this.players.has(id)) {
      this.players.delete(id);
    }
    this.playerView.removePlayer(id);
  }

  getPlayerById(id) {
    return this.players.get(id);
  }

  getSelf() {
    return Array.from(this.players.values()).filter((p) => p.getIsSelf())[0];
  }

  getSelfId() {
    return Array.from(this.players.values())
      .filter((p) => p.getIsSelf())[0]
      .getId();
  }

  getPlayerCount() {
    return this.players.size;
  }

  updatePlayerName(id, name) {
    const player = this.players.get(id);
    if (player) {
      player.setName(name);
    }

    this.playerView.updatePlayerName(id, player.getName());
  }

  getPlayersArray() {
    return Array.from(this.players.values());
  }

  assignHost(id) {
    console.log('Assigning new hoste to pid:', id);
    const player = this.players.get(id);
    player.makeHost();
    this.playerView.updatePlayerName(id, player.getName());
  }

  printPlayers() {
    console.log(this.players);
  }

  addCardToPlayerHandById(id, card) {
    this.players.get(id).addCardToHand(card);
  }

  // switchView(scene) {
  //   this.scene = scene;
  //   console.log('Setting Scene + Play Area for each player');
  //   Array.from(this.players.values()).forEach((player) => {
  //     console.log(player);
  //     player.setScene(this.scene);
  //   });
  // }

  setView(view) {
    this.playerView = view;
  }

  adjustPlayerPlayArea(id, displayParam) {
    console.log('Trying to adjust play areas');
    console.log('ID:', id);
    console.log(displayParam);
    console.log('----------------------');
    this.players.get(id).adjustPlayArea(displayParam);
  }
}
