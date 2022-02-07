import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'core/language/i18n';
import Remix from './src/remix/Remix';
import { BehaviorSubject } from 'rxjs';
import App from './App';

export const subscriber = new BehaviorSubject({
  zoom: 1,
});

const app = (
  <HashRouter>
    <HelmetProvider>
      <Remix />
      <App />
    </HelmetProvider>
  </HashRouter>
);

render(app, document.getElementById('app'));
