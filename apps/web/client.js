import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Sprite, Stage } from 'react-pixi-fiber';
import chest from 'design/assets/Chest1.png';
import * as PIXI from 'pixi.js';
import 'core/language/i18n';
import App from './App';
import Bunny from './Bunny';

const app = (
  <HashRouter>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </HashRouter>
);

render(app, document.getElementById('app'));
