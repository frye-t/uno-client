import { HandView } from './HandView';

export class PlayerGameView {
  constructor(scene, displayParams, playerCount) {
    this.scene = scene;
    this.displayParams = displayParams;
    this.playerCount = playerCount;
    this.handViews = new Map();
    this.selfId;
  }

  init(turnOrder, selfId) {
    const selfTurnIdx = turnOrder.indexOf(selfId);
    this.selfId = selfId;

    for (let i = 0; i < this.playerCount; i++) {
      const playerTurnIdx = (selfTurnIdx + i) % this.playerCount;
      const playerId = turnOrder[playerTurnIdx];
      const displayParam = this.displayParams[i];
      const isSelf = this.selfId === playerId;
      console.log('INITIALIZING A NEW HAND VIEW');
      this.handViews.set(
        playerId,
        new HandView(this.scene, displayParam, isSelf)
      );
    }
  }

  updateHandView(playerId, handData) {
    const handView = this.handViews.get(playerId);
    console.log('Updating HandView:', handData);
    const isSelf = playerId === this.selfId;
    if (handView) {
      handView.updateHand(handData, isSelf);
    }
  }

  enableHand(playerId) {
    const handView = this.handViews.get(playerId);
    handView.enableInteractive();
  }

  disableHand(playerId) {
    console.log('HAND VIEWS:', this.handViews);
    const handView = this.handViews.get(playerId);
    handView.disableInteractive();
    console.log('HAND VIEW DISABLED');
  }
}
