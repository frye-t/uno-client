import { UIText } from '../components/UIText';

export class PlayerLobbyView {
  constructor(scene) {
    this.scene = scene;
    this.playerGameObjects = new Map();
  }

  addPlayer(playerId, playerName) {
    const nameGameObject = new UIText(this.scene, playerName);
    this.playerGameObjects.set(playerId, nameGameObject);
    this.renderPlayerList();
  }

  updatePlayerName(playerId, playerName) {
    const nameUIText = this.playerGameObjects.get(playerId);
    if (nameUIText) {
      nameUIText.setText(playerName);
    }
  }

  removePlayer(playerId) {
    const nameUIText = this.playerGameObjects.get(playerId);
    if (nameUIText) {
      nameUIText.destroy(); // Remove the text object from the scene
      this.playerGameObjects.delete(playerId); // Remove the mapping
    }
    this.renderPlayerList();
  }

  render() {
    this.renderPlayerList();
  }

  renderPlayerList(offset = 100) {
    console.log('Rendering game objects');
    const playersArray = Array.from(this.playerGameObjects).sort(this.sortFunc);
    playersArray.forEach((player, idx) => {
      player[1].setLoc(700, 70 * idx + offset);
    });
  }

  sortFunc(a, b) {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return a[0] < b[0] ? -1 : 1;
    }
  }
}
