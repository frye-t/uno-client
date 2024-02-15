import { Hand } from './Hand';

export class Player {
  constructor(id, name, isSelf = false, isHost) {
    this.id = id;
    this.name = name;
    this.isSelf = isSelf;
    this.isHost = isHost;
    this.hand = new Hand();
  }

  clearHand() {
    this.hand.clear();
  }

  getId() {
    return this.id;
  }

  getName() {
    if (this.isHost) {
      return this.name + ' (H)';
    }
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  isSelf() {
    return this.isSelf();
  }

  makeHost() {
    this.isHost = true;
  }

  getIsHost() {
    return this.isHost;
  }

  getIsSelf() {
    return this.isSelf;
  }

  addCardToHand(card) {
    this.hand.addCard(card);
  }

  setScene(scene) {
    this.scene = scene;
  }
}
