import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, _app, _view } from 'design/styles/global';
import { styles, theme, zindex } from 'design';
import { Routes, Route } from 'react-router-dom';
import { USER_LANGUAGE, USER_THEME } from 'core/remix/state';
import { useRemixOrigin } from 'core/hooks/remix/useRemixOrigin';
import { PUBLIC_HOME, PUBLIC_GAME } from 'core/routes/routes';
import Game from './src/views/game/Game';
import Home from './src/views/home/Home';
import { useMobileHeight } from 'core/hooks/useMobileHeight';
import Remix from './src/remix/Remix';
// import {RpcNodeContextProvider} from './contexts/rpceNode'
const withThemes = ({ palette = 'dark' }) => ({
  ...theme[palette],
  styles,
  zindex,
});

const App = () => {
  const [language, setLanguage] = useRemixOrigin(USER_LANGUAGE, 'en');
  const [theme] = useRemixOrigin(USER_THEME, 'light');

  useEffect(() => {
    if (!localStorage.getItem('legacyPreferredNode')) {
      localStorage.setItem('legacyPreferredNode', 'http://127.0.0.1:8899');
    }
    // Set current active game but can be changed in settings
    if (!localStorage.getItem('gameName')) {
      localStorage.setItem('gameName', 'testgame1');
    }
  });

  return (
    <ThemeProvider theme={withThemes({ palette: theme })}>
      <_app>
        <Remix />
        <GlobalStyles />
        <Routes>
          <Route exact path={PUBLIC_HOME} element={<Home />} />
          <Route path={`${PUBLIC_GAME}/:view?`} element={<Game />} />
          <Route path={`${PUBLIC_GAME}/*`} element={<Game />} />
        </Routes>
      </_app>
    </ThemeProvider>
  );
};

export default App;
