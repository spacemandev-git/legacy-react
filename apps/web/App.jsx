import React from 'react';
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

const withThemes = ({ palette = 'dark' }) => ({
  ...theme[palette],
  styles,
  zindex,
});

const App = () => {
  const { vh } = useMobileHeight();
  const [language, setLanguage] = useRemixOrigin(USER_LANGUAGE, 'en');
  const [theme] = useRemixOrigin(USER_THEME, 'light');

  return (
    <ThemeProvider theme={withThemes({ palette: theme })}>
      <_app>
        <GlobalStyles />
        <_view $vh={vh}>
          <Routes>
            <Route exact path={PUBLIC_HOME} element={<Home />} />
            <Route path={`${PUBLIC_GAME}/:view?`} element={<Game />} />
            <Route path={`${PUBLIC_GAME}/*`} element={<Game />} />
          </Routes>
        </_view>
      </_app>
    </ThemeProvider>
  );
};

export default App;
