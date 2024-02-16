import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    // //  We loaded this image in our Boot Scene, so we can display it here
    // this.add.image(512, 384, 'background');
    // //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
    // //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
    // //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath('assets/cards');
    // this.load.image('logo', 'logo.png');
    // Load images for Blue, Green, Yellow, and Red cards (0-9)
    // Define card colors and types
    const cardColors = ['blue', 'green', 'yellow', 'red'];
    const cardTypes = ['draw2', 'reverse', 'skip'];

    // Load images for number cards (0-9) for each color
    for (const color of cardColors) {
      for (let i = 0; i <= 9; i++) {
        const cardName = `${color}_${i}`;
        const imageName = `${
          color.charAt(0).toUpperCase() + color.slice(1)
        }_${i}.png`;
        this.load.image(cardName, imageName);
      }
    }

    // Load images for special cards: Draw, Reverse, and Skip for each color
    for (const color of cardColors) {
      for (const type of cardTypes) {
        const cardName = `${color}_${type}`;
        const imageName = `${color.charAt(0).toUpperCase() + color.slice(1)}_${
          type.charAt(0).toUpperCase() + type.slice(1)
        }.png`;
        this.load.image(cardName, imageName);
      }
    }

    // Load additional images
    this.load.image('card_back', 'Deck.png');
    this.load.image('deck_full', 'Deck_Full.png');
    this.load.image('wild_card', 'Wild_Card.png');
    this.load.image('wild_draw4', 'Wild_Draw4.png');
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start('MainMenu');
  }
}
