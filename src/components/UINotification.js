import { UIText } from './UIText';

export class UINotification extends UIText {
  constructor(scene, text, fontSize = 50) {
    super(scene, text, fontSize);
    this.setLoc(640 - this.getGameObject().width / 2, 200);

    this.enableFadeOut(3000);
    setTimeout(() => {
      this.destroy();
    }, 3000);
  }
}
