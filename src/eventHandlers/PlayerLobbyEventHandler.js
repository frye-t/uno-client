export class PlayerLobbyEventHandler {
  constructor(scene, socket, view, controller) {
    this.playerView = view;
    this.playerController = controller;
    this.socket = socket;
    this.bindEvents();
    this.observers = [];
  }

  bindEvents() {
    this.socket.on(
      'respondPlayerData',
      this.handleRespondPlayerData.bind(this)
    );
    this.socket.on('playerJoined', this.handlePlayerJoined.bind(this));
    this.socket.on('playerCatchup', this.handlePlayerCatchup.bind(this));
    this.socket.on('playerNameChange', this.handlePlayerNameChange.bind(this));
    this.socket.on('playerDisconnect', this.handlePlayerDisconnect.bind(this));
    this.socket.on('assignNewHost', this.handleAssignNewHost.bind(this));
  }

  handleRespondPlayerData(data) {
    console.log('Got player data:', data);
    const { playerId, playerName, isHost } = data;
    const isSelf = true;
    this.playerController.addPlayer(playerId, playerName, isSelf, isHost);
  }

  handlePlayerJoined(data) {
    const { playerId, playerName, isHost } = data;
    console.log('a player joined:', data);
    this.playerController.addPlayer(playerId, playerName, false, isHost);
  }

  handlePlayerCatchup(data) {
    const { players } = data;

    players.forEach((player) => {
      // console.log("Catching up on player:", )
      this.playerController.addPlayer(
        player.id,
        player.name,
        false,
        player.isHost
      );
    });
  }

  handlePlayerNameChange(data) {
    const { playerId, playerName } = data;
    this.playerController.updatePlayerName(playerId, playerName);
  }

  handlePlayerDisconnect(data) {
    const { playerId } = data;
    this.playerController.removePlayer(playerId);
  }

  handleAssignNewHost(data) {
    const { playerId } = data;
    console.log('Got new host assignment:', playerId);
    this.playerController.assignHost(playerId);
    this.notifyNewHost();
  }

  registerObserver(observer) {
    this.observers.push(observer);
  }

  unregisterObserver(observer) {
    const idx = this.observers.indexOf(observer);
    this.observers.splice(idx, 1);
    console.log('Observers:', this.observers);
  }

  notifyNewHost() {
    const self = this.playerController
      .getPlayersArray()
      .filter((p) => p.getIsSelf())[0];
    if (self.getIsHost()) {
      try {
        this.observers.forEach((o) => o && o.updateNewHost(true));
      } catch (e) {
        console.log('updateNewHost not implemented on Observer:', e);
      }
    }
  }
}
