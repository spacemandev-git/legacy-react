import Phaser from 'phaser';
import chest from 'design/assets/Chest1.png';
import drawtiles from 'design/assets/drawtiles.png';
import { subscriber } from 'web/client';
import MapProps from './MapProps';

const IMAGE_TILES = 'IMAGE_TILES';

let props = {};

export const MapScene = MapProps(
  new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function GameScene() {
      this.cursor;
      this.controls;
      this.level = [];
      this.height = 38;
      this.width = 40;
      this.subscriber = subscriber;
      Phaser.Scene.call(this, { key: 'GameScene' });
    },

    preload: function () {
      this.load.image(IMAGE_TILES, drawtiles);
    },

    create: function () {
      const state = this.subscriber.getValue();
      const { setState } = props;

      // Fill Map with Tiles
      for (var y = 0; y < this.height; y++) {
        var row = [];
        for (var x = 0; x < this.width; x++) {
          var tileIndex = 1;
          row.push(tileIndex);
        }
        this.level.push(row);
      }

      // Add empty tiles where background space is

      // On tile hover tint tile

      // On card drop over tile resize card to tile and pulse during confirmation

      //

      const map = this.make.tilemap({
        data: this.level,
        tileWidth: 32,
        tileHeight: 32,
      });

      const tileset = map.addTilesetImage(IMAGE_TILES);
      const layer = map.createLayer(0, tileset, 0, 0);

      this.cameras.main.setBounds(0, 0, layer.width, layer.height);
      this.cameras.main.setZoom(1);

      // Controls for moving around on the map
      const cursors = this.input.keyboard.createCursorKeys();
      const controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5,
      };
      this.controls = new Phaser.Cameras.Controls.FixedKeyControl(
        controlConfig,
      );

      // box.on('clicked', this.clickHandler, this);
      // box.off('clicked', this.clickHandler);

      // this.input.on('gameobjectup', function (pointer, gameObject)
      // {
      //   gameObject.emit('clicked', gameObject);
      // }, this);
    },

    update: function (time, delta) {
      this.controls.update(delta);
    },
  }),
);
