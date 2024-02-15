export class GameState {
  constructor() {
    this.players = [];
    this.discardPile = [];
    this.activeColor = '';
    this.activeNumber = '';
    this.turnOrder = [];
  }

  update(gameState) {
    this.players = gameState.players;
    this.discardPile = gameState.discardPile;
    this.activeColor = gameState.activeColor;
    this.activeNumber = gameState.activeNumber;
    this.turnOrder = gameState.turnOrder;

    console.log('Received Checksum:', gameState.checksum);
    console.log('Generated Checksum:', this.generateChecksum());
  }

  generateChecksum() {
    const str = JSON.stringify(this);
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }

    return hash >>> 0;
  }
}
