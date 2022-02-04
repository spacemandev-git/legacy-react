import Phaser from 'phaser';
import eye from 'design/assets/lance-overdose-loader-eye.png';
import CardProps from './CardProps';
import { subscriber } from 'web/client';
import { forEach } from 'lodash';

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
      this.page = 0;
      this.page_size = 6;
      this.card_ids = {};
    },

    preload: function () {
      // this.load.image('eye', eye);
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

      // Arrow up for cards
      const arrow_up = this.add
        .rectangle(144, 88, 204, 48, 0x8d94f6)
        .setInteractive({ cursor: 'pointer' });

      arrow_up.on('clicked', () => {
        const prev_page = this.page;
        this.page = this.page > 0 ? this.page - 1 : this.page;
        if (this.card_list && prev_page !== this.page) changeCards();
      });

      // Arrow down for cards
      const arrow_down = this.add
        .rectangle(144, 544, 204, 48, 0x8d94f6)
        .setInteractive({ cursor: 'pointer' });

      arrow_down.on('clicked', () => {
        const prev_page = this.page;
        this.page = this.page + 1;
        if (this.card_list && prev_page !== this.page) changeCards();
      });

      // Reusable function for changing cards
      const changeCards = () => {
        for (let i = 0; i < this.card_list.length; i++) {
          const card = this.card_list[i]?.card;
          if (card.page === this.page) {
            card.setVisible(true);
            const position = card.count - this.page * this.page_size;
            const card_position = {
              [1]: [86, 200],
              [2]: [202, 200],
              [3]: [86, 316],
              [4]: [202, 316],
              [5]: [86, 432],
              [6]: [202, 432],
            }[position];
            card.setPosition(card_position?.[0], card_position?.[1]);
          } else {
            card.setVisible(false);
          }
        }
      };

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
          props.getCards();
          // const state = subscriber.getValue();
          // setState({ ...state, zoom: state.zoom - 0.1 });
        },
        this,
      );

      zoom_in.on(
        'clicked',
        () => {
          // const state = subscriber.getValue();
          // setState({ ...state, zoom: state.zoom + 0.1 });
        },
        this,
      );

      // Test drag and drop onto tile

      // const eye_img = this.add
      //   .sprite(86, 200, 'eye')
      //   .setInteractive({ cursor: 'pointer' });
      //
      // eye_img.displayWidth = 88;
      // eye_img.displayHeight = 88;
      // this.input.setDraggable(eye_img);

      // Title
      this.title = this.add.text(40, 14, 'Legacy', {
        font: '32px Arial Black',
        fill: '#fff',
      });
      this.title.setShadow(2, 2, '#333333', 2, true, true);

      // Control Hover Start
      this.input.on('pointerover', function (pointer, gameObject) {
        const state = subscriber.getValue();
      });

      // Control Hover End
      this.input.on('pointerout', function (pointer, gameObject) {
        // gameObject?.setTint(0xff0000);
        const state = subscriber.getValue();
      });

      // Event Drag Start
      this.input.on('dragstart', function (pointer, gameObject) {
        gameObject.setAlpha(0.2);
        const state = subscriber.getValue();
        setState({ ...state, drag: { pointer } });
      });

      // Event Drag
      this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
      });

      // Event Drag End
      this.input.on('dragend', function (pointer, gameObject) {
        gameObject.setAlpha(1);
        const state = subscriber.getValue();
        setState({
          ...state,
          drag: undefined,
          drop: {
            gameObject,
            pointer,
          },
        });
      });

      // Event Tile Click
      this.input.on('pointerdown', function (
        pointer,
        gameObject,
        dragX,
        dragY,
      ) {
        const state = subscriber.getValue();
        if (!state.drag) setState({ ...state, pointerdown: { pointer } });
      });

      // Event Tile Click
      this.input.on('pointerup', function (pointer, gameObject, dragX, dragY) {
        const state = subscriber.getValue();
        if (!state.drag)
          setState({
            ...state,
            pointerup: { pointer },
            pointerdown: undefined,
          });
      });

      // Event GameObject Click
      this.input.on(
        'gameobjectup',
        function (pointer, gameObject) {
          gameObject.emit('clicked', gameObject);
        },
        this,
      );
    },
    update: function () {
      const state = this.subscriber.getValue();
      const { setState } = props;
      const { width, height } = this.scale;
      const x = width * 0.5;
      const y = height * 0.5;

      // When cards are updated render card list
      if (state.cards) {
        let card_list = [];

        let count = 1;
        for (let i = 1; i <= state.cards.length; i++) {
          let next_card;
          const card = state.cards[i - 1];
          this.card_ids = { ...this.card_ids, [card.id]: i };

          if (this.textures.exists(card.id)) {
            next_card = this.add.image(x, y, card.id);
            next_card.count = this.card_ids[card.id];
            const position = next_card.count - this.page * this.page_size;
            const card_position = {
              [1]: [86, 200],
              [2]: [202, 200],
              [3]: [86, 316],
              [4]: [202, 316],
              [5]: [86, 432],
              [6]: [202, 432],
            }[position];
            const next_sprite = this.add.sprite(
              card_position?.[0],
              card_position?.[1],
              card.id,
            );
            next_sprite.setInteractive({ cursor: 'pointer' });
            next_sprite.displayWidth = 88;
            next_sprite.displayHeight = 88;
            next_sprite.count = count;
            next_sprite.page =
              1 + Math.floor(next_sprite.count / (this.page_size + 0.01));
            this.input.setDraggable(next_card);
            count++;
          } else {
            next_card = this.add.image(x, y, 'card-back');
            this.load.image(card.id, card.url);
            this.load.once(Phaser.Loader.Events.COMPLETE, () => {
              next_card.count = this.card_ids[card.id];
              const position = next_card.count - this.page * this.page_size;
              const card_position = {
                [1]: [86, 200],
                [2]: [202, 200],
                [3]: [86, 316],
                [4]: [202, 316],
                [5]: [86, 432],
                [6]: [202, 432],
              }[position];

              const next_sprite = this.add.sprite(
                card_position?.[0],
                card_position?.[1],
                card.id,
              );
              next_sprite.setTexture(card.id);

              next_sprite.setInteractive({ cursor: 'pointer' });
              next_sprite.displayWidth = 88;
              next_sprite.count = this.card_ids[card.id];
              next_sprite.displayHeight = 88;
              next_sprite.page = Math.floor(
                next_sprite.count / (this.page_size + 0.01),
              );
              this.input.setDraggable(next_sprite);

              // If not on first page setVisible false
              if (next_sprite.page !== this.page) {
                console.log('hide', next_sprite);
                next_sprite.setVisible(false);
              }
              card_list.push({ card: next_sprite });
            });
            this.load.start();
          }
          count++;
        }

        this.card_list = card_list;

        setState({ ...state, cards: undefined });
      }
    },
  }),
);
