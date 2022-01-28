import Phaser from 'phaser';
import drawtiles from 'design/assets/drawtiles.png';
import walls from 'design/assets/walls.png';

const IMAGE_CHEST = 'IMAGE_CHEST';
const IMAGE_TILES = 'IMAGE_TILES';

let controls;
var t = 0;
var width = 40;
var height = 38;

export default class MapScene extends Phaser.Scene {
  constructor() {
    super('mapscene');
    this.cursor;
    this.controls;
  }

  preload() {
    this.load.image(IMAGE_TILES, drawtiles);
  }

  create() {
    var level = [];
    for (var y = 0; y < height; y++) {
      var row = [];
      for (var x = 0; x < width; x++) {
        var tileIndex = Phaser.Math.RND.integerInRange(1, 6);
        row.push(tileIndex);
      }
      level.push(row);
    }

    var map = this.make.tilemap({ data: level, tileWidth: 32, tileHeight: 32 });
    var tileset = map.addTilesetImage(IMAGE_TILES);
    var layer = map.createLayer(0, tileset, 0, 0);

    // this.input.setDraggable(image);

    // minimap
    this.cameras.main.setBounds(0, 0, layer.width, layer.height);
    this.minimap = this.cameras.add(640, 440, 150, 150).setZoom(0.2);
    this.minimap.setBackgroundColor('#ffff00');

    var cursors = this.input.keyboard.createCursorKeys();
    var controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5,
    };
    controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    this.minimap.scrollX = (width * 32) / 2 + Math.cos(16) * 300;
    this.minimap.scrollY = (height * 32) / 2 + Math.sin(16) * 300;
  }
  update(time, delta) {
    controls.update(delta);
    // this.minimap.scrollX = width * 32 / 2 + Math.cos(16) * 300;
    // this.minimap.scrollY = height * 32 / 2 + Math.sin(16) * 300;
  }
}
