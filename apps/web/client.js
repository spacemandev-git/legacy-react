import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'core/language/i18n';
import Phaser from 'phaser';
import App from './App';
import { MapScene } from './src/views/game/scenes/MapScene';
import CardsScene from './src/views/game/scenes/Cards';
import eye from 'design/assets/lance-overdose-loader-eye.png';
import box from 'design/assets/128x128-v2.png';
import { CardScene } from './src/views/game/scenes/CardScene';

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  parent: 'phaser-example',
  pixelArt: true,
  scene: [MapScene, CardScene],
};

var game = new Phaser.Game(config);

const app = (
  <HashRouter>
    <HelmetProvider></HelmetProvider>
  </HashRouter>
);

render(app, document.getElementById('app'));
