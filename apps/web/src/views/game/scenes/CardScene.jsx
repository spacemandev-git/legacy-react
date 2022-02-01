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
      this.previous = {};
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

      zoom_out.on(
        'clicked',
        () => {
          const state = subscriber.getValue();
          setState({ ...state, zoom: state.zoom - 0.1 });
        },
        this,
      );

      zoom_in.on(
        'clicked',
        () => {
          const state = subscriber.getValue();
          setState({ ...state, zoom: state.zoom + 0.1 });
        },
        this,
      );

      // Test drag and drop onto tile
      const eye_img = this.add
        .sprite(86, 200, 'eye')
        .setInteractive({ cursor: 'pointer' });

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
      this.input.on('pointerover', function (pointer, gameObject) {
        const state = subscriber.getValue();
        setState({ ...state, hello: 'test' });
      });

      // Control Hover End
      this.input.on('pointerout', function (pointer, gameObject) {
        // gameObject?.setTint(0xff0000);
        const state = subscriber.getValue();

        setState({ ...state, hello: 'test' });
      });

      // Event Drag Start
      this.input.on('dragstart', function (pointer, gameObject) {
        eye_img.setAlpha(0.2);
      });

      // Event Drag
      this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
      });

      // Event Drag End
      this.input.on('dragend', function (pointer, gameObject) {
        eye_img.setAlpha(1);
        const state = subscriber.getValue();
        setState({
          ...state,
          drop: {
            gameObject,
            pointer,
          },
        });
        console.log(pointer);
      });

      // Event Click
      this.input.on(
        'gameobjectup',
        function (pointer, gameObject) {
          gameObject.emit('clicked', gameObject);
        },
        this,
      );

      // Add Cards to empty card slots

      // Text page numbers
    },
    update: function () {
      // const state = this.subscriber.getValue();
      // const { setState } = props;
      //
      //
      //
      // this.previous = {...state};
    },
  }),
);
