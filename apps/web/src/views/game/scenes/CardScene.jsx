import Phaser from 'phaser';
import CardProps from './CardProps';
import { subscriber } from 'web/client';

import balkanian1 from 'design/assets/units/balkania_1.png';
import balkanian3 from 'design/assets/units/balkania_3.png';
import drone1 from 'design/assets/units/drone_1.png';
import enclave1 from 'design/assets/units/enclave_1.png';
import enclave3 from 'design/assets/units/enclave_3.png';
import jet1 from 'design/assets/units/jet_1.png';
import khan1 from 'design/assets/units/khan_1.png';
import khan3 from 'design/assets/units/khan_3.png';
import mechaniker1 from 'design/assets/units/mechaniker_1.png';
import mechaniker3 from 'design/assets/units/mechaniker_3.png';
import saharan1 from 'design/assets/units/saharan_1.png';
import saharan3 from 'design/assets/units/saharan_3.png';

const BALKANIAN_1 = 'balkania_1.png';
const BALKANIAN_3 = 'balkania_3.png';
const DRONE_1 = 'drone_1.png';
const ENCLAVE_1 = 'enclave_1.png';
const ENCLAVE_3 = 'enclave_3.png';
const JET_1 = 'jet_1.png';
const KHAN_1 = 'khan_1.png';
const KHAN_3 = 'khan_3.png';
const MECHANIKER_1 = 'mechaniker_1.png';
const MECHANIKER_3 = 'mechaniker_3.png';
const SAHARAN_1 = 'saharan_1.png';
const SAHARAN_3 = 'saharan_3.png';

let props = {};

export const getCardTypeObj = (card) => {
  return card.cardType?.unit?.unit || card.cardType?.unitMod?.umod;
};

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
      this.load.image(BALKANIAN_1, balkanian1);
      this.load.image(BALKANIAN_3, balkanian3);
      this.load.image(DRONE_1, drone1);
      this.load.image(ENCLAVE_1, enclave1);
      this.load.image(ENCLAVE_3, enclave3);
      this.load.image(JET_1, jet1);
      this.load.image(KHAN_1, khan1);
      this.load.image(KHAN_3, khan3);
      this.load.image(MECHANIKER_1, mechaniker1);
      this.load.image(MECHANIKER_3, mechaniker3);
      this.load.image(SAHARAN_1, saharan1);
      this.load.image(SAHARAN_3, saharan3);
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
      this.title = this.add
        .text(40, 14, 'Legacy', {
          font: '32px Arial Black',
          fill: '#fff',
        })
        .setInteractive({ cursor: 'pointer' });

      this.title.setShadow(2, 2, '#333333', 2, true, true);

      // Go home on click
      this.title.on('pointerdown', () => {
        const state = subscriber.getValue();
        state.history('/');
      });

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

      const { player, cardsRendered } = state;

      if (player?.cards?.length > 0 && !cardsRendered) {
        let card_list = [];
        for (let i = 1; i <= player.cards.length; i++) {
          const card = getCardTypeObj(player.cards[i - 1]);
          this.card_ids = { ...this.card_ids, [card.link]: i };

          const position = i - this.page * this.page_size;
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
            card.link,
          );
          next_sprite.setInteractive({ cursor: 'pointer' });
          next_sprite.displayWidth = 88;
          next_sprite.displayHeight = 88;
          next_sprite.count = i;
          next_sprite.page =
            1 + Math.floor(next_sprite.count / (this.page_size + 0.01));
          this.input.setDraggable(next_sprite);
        }

        this.card_list = card_list;

        setState({ ...state, cardsRendered: true });
      }
    },
  }),
);
