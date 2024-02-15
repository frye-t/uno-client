export class Card {
  constructor(rank = 'back', suit = 'card') {
    this.rank = rank;
    this.suit = suit;
  }

  getSpriteStr() {
    return this.suit.toLowerCase() + '_' + this.rank.toLowerCase();
  }
}
