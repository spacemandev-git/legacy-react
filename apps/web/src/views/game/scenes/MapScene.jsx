import Phaser from 'phaser';
import chest from 'design/assets/Chest1.png';
import drawtiles from 'design/assets/drawtiles.png';
import { subscriber } from 'web/client';
import MapProps from './MapProps';
import eye from 'design/assets/lance-overdose-loader-eye.png';

const IMAGE_TILES = 'IMAGE_TILES';

let props = {};

export const MapScene = MapProps(
  new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function GameScene() {
      this.cursor;
      this.controls;
      this.tile_layer;
      this.level = [];
      this.tiles = {};
      this.layer = {};
      this.height = 38;
      this.width = 40;
      this.subscriber = subscriber;
      this.position = {
        x: 290,
        y: 66,
      };
      props = this.props;
      Phaser.Scene.call(this, { key: 'GameScene' });
    },

    preload: function () {
      this.load.image(IMAGE_TILES, drawtiles);
    },

    create: function () {
      const state = this.subscriber.getValue();
      const { setState } = props;

      // Fill Map with Tiles
      for (let y = 0; y < this.height; y++) {
        const row = [];
        for (let x = 0; x < this.width; x++) {
          const tileIndex = 1;
          row.push(tileIndex);
        }
        this.level.push(row);
      }

      // Add empty tiles where background space is

      // On tile hover tint tile

      // Create the initial tilemap once map loads
      this.map = this.make.tilemap({
        data: this.level,
        tileWidth: 32,
        tileHeight: 32,
      });

      // Create the map layer
      // this.tile_layer = this.map.addTilesetImage(IMAGE_TILES);
      // this.map.createLayer('Tile Layer', this.tile_layer, 0, 0);

      // // Add feature layer
      // this.tiles.eye = this.map.addTilesetImage('eye');
      // this.layer.eye = this.map.createLayer('Eye Layer', this.tiles.eye, 0, 0);

      const tileset = this.map.addTilesetImage(IMAGE_TILES);
      console.log(tileset);
      const layer = this.map.createLayer(0, tileset, 0, 0);

      this.cameras.main.setBounds(0, 0, layer.width, layer.height);
      this.cameras.main.setZoom(state.zoom);
      this.cameras.main.width = 476;
      this.cameras.main.height = 500;

      this.cameras.main.setPosition(this.position.x, this.position.y);

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

      // Event Drag End
      this.input.on('drag', function (pointer, gameObject) {
        console.log(pointer);
      });
    },

    update: function (time, delta) {
      const state = this.subscriber.getValue();

      if (state.drop) {
        const tiles = this.map.getTilesWithinWorldXY(
          state.drop.pointer.worldX - this.position.x,
          state.drop.pointer.worldY - this.position.y,
          1,
          1,
        );
        const tile = tiles[0];
        this.playCard(tile, state.drop);
      }

      this.controls.update(delta);
      if (this.previous?.zoom !== state.zoom) {
        this.cameras.main.setZoom(state.zoom);
      }

      this.previous = { ...state };
    },

    playCard: function (tile, drop) {
      const state = this.subscriber.getValue();
      const { setState } = props;

      if (tile) {
        console.log(tile);
        // this.map.replaceByIndex(tile.index, 3, tile.x, tile.y, tile.width, tile.height, tile.layer);
        this.map.replaceByIndex(tile.index, 12, tile.x, tile.y, 1, 1);
        drop.gameObject.setVisible(false);
      }
      setState({ ...state, drop: undefined });

      // Play a unit

      // Play a mod
    },
  }),
);
