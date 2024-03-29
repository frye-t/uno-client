export class SocketController {
  constructor(socket) {
    this.socket = socket;
    this.bindSocketEvents();
    this.eventCallbacks = new Map();
    console.log('CREATING SOCKET CONTROLLER');
  }

  bindSocketEvents() {
    this.socket.on('allPlayersLoaded', this.handleAllPlayersLoaded.bind(this));
    this.socket.on('gameState', this.handleGameState.bind(this));
    this.socket.on('turnStart', this.handleTurnStart.bind(this));
    this.socket.on('turnWaiting', this.handleTurnWaiting.bind(this));
    this.socket.on('chooseColor', this.handleChooseColor.bind(this));

    this.socket.onAny((eventName, data) => {
      this.handleEventCallback(eventName, data);
    });
  }

  setCallbackForEvent(eventName, callback) {
    this.eventCallbacks.set(eventName, callback);
  }

  handleEventCallback(eventName, data) {
    const callback = this.eventCallbacks.get(eventName);
    if (callback) {
      callback(data);
    }
  }

  handleGameState(data) {
    const gameState = JSON.parse(data);
    console.log('Got a GameState:');
    console.log(gameState);
  }

  handleTurnStart() {
    console.log("It's your turn!");
  }

  handleTurnWaiting(data) {
    console.log('Got a turn waiting:', data);
  }

  handleChooseColor(data) {
    console.log('You need to choose a color!');
    console.log(data);
  }

  handleAllPlayersLoaded(data) {
    // Do something once all players are loaded
  }

  sendGameLoaded() {
    this.socket.emit('gameLoaded');
  }

  sendStartGame() {
    this.socket.emit('startGame');
  }

  sendPlayCard(id, cardData) {
    const { suit, rank } = cardData;
    console.log('Emitting playCard:', rank, suit);
    this.socket.emit('playCard', { id, suit, rank });
  }

  sendDrawCard() {
    this.socket.emit('drawCard');
  }

  sendChooseColor(color) {
    this.socket.emit('additionalAction', {
      action: 'colorChosen',
      value: color,
    });
  }

  sendHandleChallenge(value) {
    this.socket.emit('additionalAction', {
      action: 'handleChallenge',
      value: value.toString(),
    });
  }

  sendDeclareUno() {
    this.socket.emit('additionalAction', {
      action: 'declareUno',
      value: 'true',
    });
  }

  sendCallUndeclaredUno(playerId) {
    this.socket.emit('additionalAction', {
      action: 'callUndeclaredUno',
      value: playerId,
    });
  }
}
