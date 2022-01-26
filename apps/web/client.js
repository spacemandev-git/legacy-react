import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'core/language/i18n';
import App from './App';
import logoImg from 'design/assets/phaser.png';
import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
  },
};
const game = new Phaser.Game(config);
function preload() {
  this.load.image('logo', logoImg);
}
function create() {
  const logo = this.add.image(400, 150, 'logo');
  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 2000,
    ease: 'Power2',
    yoyo: true,
    loop: -1,
  });
}

const app = (
  <HashRouter>
    <HelmetProvider>
      <App />
      {game}
    </HelmetProvider>
  </HashRouter>
);

render(app, document.getElementById('app'));
