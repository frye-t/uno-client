import { Scene } from 'phaser';
import { UIButton } from '../components/UIButton';
import { UIText } from '../components/UIText';

import { PlayerLobbyView } from '../views/PlayerLobbyView';
import { PlayerController } from '../controllers/PlayerController';
import { PlayerLobbyEventHandler } from '../eventHandlers/PlayerLobbyEventHandler';
import { SocketController } from '../controllers/SocketController';

export class Lobby extends Scene {
  constructor() {
    super('Lobby');
  }

  init(data) {
    this.GAME_WIDTH = this.scene.systems.game.config.width;
    this.GAME_HEIGHT = this.scene.systems.game.config.height;
    this.socket = data.socket;
    this.roomCode = data.roomCode;
    this.isHost = data.isHost;

    this.bindSocketEvents();

    this.playerView = new PlayerLobbyView(this);
    this.playerController = new PlayerController(this.playerView);

    this.playerEventHandler = new PlayerLobbyEventHandler(
      this,
      this.socket,
      this.playerView,
      this.playerController
    );
    this.playerEventHandler.registerObserver(this);

    this.setupPlayers();

    this.nameInput = document.getElementById('nameInput');
  }

  setupPlayers() {
    this.socket.emit('requestPlayerData');
    if (!this.isHost) {
      this.socket.emit('playerCatchup');
    }
  }

  bindSocketEvents() {
    this.socket.on('gameStarted', this.handleGameStarted.bind(this));
  }

  handleGameStarted() {
    console.log('Game has started');
    this.nameInput.style.display = 'none';
    this.playerEventHandler.unregisterObserver(this);
    console.log('PLAYER CONTROLLER IN LOBBY:', this.playerController);

    const socketController = new SocketController(this.socket);

    this.scene.start('Game', {
      socket: this.socket,
      isHost: this.isHost,
      playerController: this.playerController,
      socketController,
    });
  }

  // RENDER UI

  create() {
    this.add.image(640, 360, 'background');
    this.add
      .text(640, this.GAME_HEIGHT - 100, 'Lobby', {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5);

    this.renderLobbyCode();
    if (this.isHost) {
      this.renderStartButton();
    }

    this.renderChangeName();
  }

  renderLobbyCode() {
    const lobbyButton = new UIButton(this, this.roomCode);
    lobbyButton.setLoc(300, 75);
    lobbyButton.onClick(() => {
      this.handleLobbyCodeClicked(lobbyButton);
    });
  }

  renderStartButton() {
    const startGameButton = new UIButton(this, 'Start Game');
    startGameButton.setLoc(300, 275);
    startGameButton.onClick(this.handleStartButtonClicked.bind(this));
  }

  renderChangeName() {
    const changeNameButton = new UIButton(this, 'Change Name');
    changeNameButton.setLoc(this.GAME_WIDTH / 2, 460);
    changeNameButton.onClick(this.handleChangeNameButtonClicked.bind(this));

    this.nameInput.style.display = 'inline-block';
  }

  // CLICK HANDLERS

  handleLobbyCodeClicked(button) {
    navigator.clipboard.writeText(this.roomCode);

    const roomCodeCopiedText = new UIText(this, 'Copied to Clipboard');
    roomCodeCopiedText.anchorBelow(button.getRect());
    roomCodeCopiedText.enableFadeOut(2000);
  }

  handleStartButtonClicked() {
    this.socket.emit('setupGame');
  }

  handleChangeNameButtonClicked() {
    const name = this.nameInput.value;
    this.socket.emit('playerChangeName', { name });
  }

  updateNewHost() {
    this.isHost = true;
    this.renderStartButton();
  }
}
