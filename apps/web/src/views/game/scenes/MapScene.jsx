import Phaser from 'phaser';
import chest from 'design/assets/Chest1.png';
import drawtiles from 'design/assets/drawtiles.png';

const IMAGE_TILES = 'IMAGE_TILES';

export const MapScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function GameScene() {
    this.cursor;
    this.controls;
    this.level = [];
    this.height = 38;
    this.width = 40;
    Phaser.Scene.call(this, { key: 'GameScene' });
  },

  preload: function () {
    this.load.image(IMAGE_TILES, drawtiles);
  },

  create: function () {
    // Fill Map with Tiles
    for (var y = 0; y < this.height; y++) {
      var row = [];
      for (var x = 0; x < this.width; x++) {
        var tileIndex = Phaser.Math.RND.integerInRange(1, 6);
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
    // this.minimap = this.cameras.add(640, 440, 150, 150).setZoom(0.2);
    // this.minimap.setBackgroundColor('#ffff00');

    console.log(this.minimap);

    const cursors = this.input.keyboard.createCursorKeys();
    const controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5,
    };
    this.cameras.main.setZoom(1);
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
    //
    // this.minimap.scrollX = this.width * 32 / 2 + Math.cos(16) * 300;
    // this.minimap.scrollY = this.height * 32 / 2 + Math.sin(16) * 300;
  },

  update: function (time, delta) {
    this.controls.update(delta);
  },
});

//
// var GameScene = new Phaser.Class({
//
//     Extends: Phaser.Scene,
//
//     initialize:
//
//         function GameScene ()
//         {
//             Phaser.Scene.call(this, { key: 'GameScene' });
//         },
//
//     preload: function ()
//     {
//         this.load.image('box', 'assets/sprites/128x128-v2.png');
//     },
//
//     create: function ()
//     {
//         // this.input.setGlobalTopOnly(true);
//
//         var box = this.add.image(400, 300, 'box').setInteractive();
//
//         box.on('pointerdown', function () {
//
//             box.tint = Math.random() * 0xffffff;
//
//         });
//     }
//
// });
//
// var UIScene = new Phaser.Class({
//
//     Extends: Phaser.Scene,
//
//     initialize:
//
//         function UIScene ()
//         {
//             Phaser.Scene.call(this, { key: 'UIScene', active: true });
//         },
//
//     preload: function ()
//     {
//         this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
//     },
//
//     create: function ()
//     {
//         var image = this.add.sprite(200, 300, 'eye').setInteractive();
//
//         this.input.setDraggable(image);
//
//         this.input.on('dragstart', function (pointer, gameObject) {
//
//             gameObject.setTint(0xff0000);
//
//         });
//
//         this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
//
//             gameObject.x = dragX;
//             gameObject.y = dragY;
//
//         });
//
//         this.input.on('dragend', function (pointer, gameObject) {
//
//             gameObject.clearTint();
//
//         });
//     }
//
// });
//
// var config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     backgroundColor: '#000000',
//     parent: 'phaser-example',
//     scene: [ GameScene, UIScene ]
// };
//
// var game = new Phaser.Game(config);
