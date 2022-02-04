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
      props = this.props;
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

      Phaser.Scene.call(this, { key: 'GameScene' });
    },

    preload: function () {
      this.load.image(IMAGE_TILES, drawtiles);
    },
    create: function () {
      const state = this.subscriber.getValue();
      const { setState } = props;

      const total_tiles = 255;
      const tile_height = 32;
      const tile_width = 32;

      // Fill Map with Tiles
      for (let y = 0; y < total_tiles; y++) {
        const row = [];
        for (let x = 0; x < total_tiles; x++) {
          const tileIndex = 1;
          row.push(tileIndex);
        }
        this.level.push(row);
      }

      // Add empty tiles where background space is
      // Event Tile Click

      // On tile hover tint tile

      // Create the initial tilemap once map loads
      this.map = this.make.tilemap({
        data: this.level,
        tileWidth: 32,
        tileHeight: 32,
      });

      // Create the map layer
      this.tile_layer = this.map.addTilesetImage(IMAGE_TILES);
      this.map.createLayer('Tile Layer', this.tile_layer, 0, 0);

      // Add feature layer
      this.tiles.eye = this.map.addTilesetImage('eye');
      this.layer.eye = this.map.createLayer('Eye Layer', this.tiles.eye, 0, 0);

      const tileset = this.map.addTilesetImage(IMAGE_TILES);
      const layer = this.map.createLayer(0, tileset, 0, 0);

      this.cameras.main.setBounds(
        0,
        0,
        total_tiles * tile_width,
        total_tiles * tile_height,
      );
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
    },
    playCard: function (tile, drop) {
      const state = this.subscriber.getValue();
      const { setState } = props;

      if (tile) {
        console.log('tile', tile);
        this.map.replaceByIndex(tile.index, 12, tile.x, tile.y, 1, 1);
        drop.gameObject.setVisible(false);
      }
      setState({ ...state, drop: undefined });

      // Play a unit

      // Play a mod
    },
    update: function (time, delta) {
      const state = this.subscriber.getValue();
      const { setState } = props;

      // Handle Click
      if (state.pointerdown) {
        const pointer = state.pointerdown.pointer;
        console.log('pointer', pointer);
        const tiles = this.map.getTilesWithinWorldXY(
          pointer.worldX,
          pointer.worldY,
          1,
          1,
        );
        const tile = tiles[0];
        if (tile) {
          // If type of tile click calculate range of attack

          console.log('tile', tile);
          tile.setAlpha(0.5);
        }
        setState({ ...state, pointerdown: undefined });
      }

      // hover over tile with card
      if (state.drag) {
        console.log('state', state);
        const tiles = this.map.getTilesWithinWorldXY(
          state.drag.pointer.worldX - this.position.x,
          state.drag.pointer.worldY - this.position.y,
          1,
          1,
        );
        const tile = tiles[0];
        if (tile) {
          const prev_hover = state.hover;
          setState({ ...state, hover: { tile } });
          if (prev_hover) prev_hover.tile.setAlpha(1);
          tile.setAlpha(0.6);
        }
      }

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
  }),
);
