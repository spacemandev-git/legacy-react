import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'core/language/i18n';
// import Phaser from 'phaser';
// import { MapScene } from './src/views/game/scenes/MapScene';
// import { CardScene } from './src/views/game/scenes/CardScene';
import Remix from './src/remix/Remix';
import { BehaviorSubject } from 'rxjs';
import App from './App';

// const config = {
//   type: Phaser.AUTO,
//   width: 800,
//   height: 600,
//   backgroundColor: '#000000',
//   parent: 'phaser-example',
//   pixelArt: true,
//   scene: [MapScene, CardScene],
// };

// const game = new Phaser.Game(config);

export const subscriber = new BehaviorSubject({});

const app = (
  <HashRouter>
    <HelmetProvider>
      <Remix />
      <App />
    </HelmetProvider>
  </HashRouter>
);

render(app, document.getElementById('app'));
