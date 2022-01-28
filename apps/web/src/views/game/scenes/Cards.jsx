import Phaser from 'phaser';
import chest from 'design/assets/Chest1.png';
import MapScene from './Map';

const IMAGE_CHEST = 'IMAGE_CHEST';
//
// const config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     pixelArt: true,
//     scene: [CardsScene, MapScene]
// }
//
//
// export default new Phaser.Game(config)

export default class CardsScene extends Phaser.Scene {
  constructor() {
    super('cards');

    this.cursor;
  }

  initialize() {
    Phaser.Scene.call(this, { key: 'cards' });
  }

  preload() {
    this.load.image(IMAGE_CHEST, chest);
  }

  create() {
    const image = this.add.sprite(100, 100, IMAGE_CHEST).setInteractive();
    image.setScale(0.1, 0.1);

    // image.scale.setTo(0.5,0.5);

    this.input.setDraggable(image);

    this.input.on('dragstart', function (pointer, gameObject) {
      gameObject.setTint(0x99cccc);
    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', function (pointer, gameObject) {
      gameObject.clearTint();
    });
  }
  update(time, delta) {}
}
