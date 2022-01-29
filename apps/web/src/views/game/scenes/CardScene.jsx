import Phaser from 'phaser';
import eye from 'design/assets/lance-overdose-loader-eye.png';
import CardProps from './CardProps';
import { subscriber } from 'web/client';

let props = {};

export const CardScene = CardProps(
  new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function CardScene() {
      Phaser.Scene.call(this, { key: 'CardScene', active: true });
      props = this.props;
      this.title;
      this.subscriber = subscriber;
    },

    preload: function () {
      this.load.image('eye', eye);
    },

    create: function () {
      const state = this.subscriber.getValue();
      const { setState } = props;

      // Background rectangles
      this.add.rectangle(144, 300, 288, 600, 0x6666ff);
      this.add.rectangle(400, 32, 800, 64, 0x6666ff);
      this.add.rectangle(784, 300, 32, 600, 0x6666ff);
      this.add.rectangle(400, 584, 800, 32, 0x6666ff);

      // Empty card slots
      this.add
        .rectangle(86, 200, 88, 88, 0x5c53df)
        .setInteractive({ cursor: 'pointer' });
      this.add
        .rectangle(202, 200, 88, 88, 0x5c53df)
        .setInteractive({ cursor: 'pointer' });
      this.add
        .rectangle(86, 316, 88, 88, 0x5c53df)
        .setInteractive({ cursor: 'pointer' });
      this.add
        .rectangle(202, 316, 88, 88, 0x5c53df)
        .setInteractive({ cursor: 'pointer' });
      this.add
        .rectangle(86, 432, 88, 88, 0x5c53df)
        .setInteractive({ cursor: 'pointer' });
      this.add
        .rectangle(202, 432, 88, 88, 0x5c53df)
        .setInteractive({ cursor: 'pointer' });

      // Arrow up and down for cards
      const arrow_up = this.add
        .rectangle(144, 88, 204, 48, 0x8d94f6)
        .setInteractive({ cursor: 'pointer' });
      const arrow_down = this.add
        .rectangle(144, 544, 204, 48, 0x8d94f6)
        .setInteractive({ cursor: 'pointer' });

      // Coordinates Input
      this.add.rectangle(652, 36, 128, 32, 0x5c53df);
      this.add
        .rectangle(740, 36, 56, 32, 0x8d94f6)
        .setInteractive({ cursor: 'pointer' });

      // Zoom Level
      const zoom_out = this.add
        .circle(308, 36, 16, 0x8d94f6)
        .setInteractive({ cursor: 'pointer' });
      const zoom_in = this.add
        .circle(348, 36, 16, 0x8d94f6)
        .setInteractive({ cursor: 'pointer' });

      // Test drag and drop onto tile
      const eye_img = this.add.sprite(86, 200, 'eye').setInteractive();

      eye_img.displayWidth = 88;
      eye_img.displayHeight = 88;
      this.input.setDraggable(eye_img);

      // Title
      this.title = this.add.text(40, 14, 'Legacy', {
        font: '32px Arial Black',
        fill: '#fff',
      });
      this.title.setShadow(2, 2, '#333333', 2, true, true);

      // Control Hover Start
      this.input.on('pointerover', function (
        pointer,
        gameObject,
        dragX,
        dragY,
      ) {
        gameObject.x = dragX;
        gameObject.y = dragY;
        setState({ ...state, hello: 'test' });
      });

      // Control Hover End
      this.input.on('pointerout', function (pointer, gameObject) {
        // gameObject?.setTint(0xff0000);

        console.log('state', state);
        console.log(gameObject);
        setState({ ...state, hello: 'test' });
      });

      // Add Cards to empty card slots

      // Text page numbers

      // var image = this.add.sprite(600, 96, 'eye').setInteractive();
      // image.setScale(0.5);

      // console.log(image);

      // this.input.setDraggable(image);

      // this.input.on('pointerover', function (pointer, gameObject) {
      //
      //     gameObject.setTint(0xff0000);
      //
      // });
      //

      this.input.on('dragend', function (pointer, gameObject) {
        gameObject.clearTint();
      });
    },

    update: function () {
      // console.log(this.state.getValue());
    },
  }),
);
