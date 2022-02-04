import React from 'react';
import { _home } from './Home.styled';
import { Link } from 'react-router-dom';
import { PUBLIC_GAME } from 'core/routes/routes';
import Login from '../game/settings/login/Login';
import Settings from '../game/settings/Settings';
import { _view } from 'design/styles/global';
import { useMobileHeight } from 'core/hooks/useMobileHeight';

const Home = () => {
  const { vh } = useMobileHeight();
  return (
    <_view $vh={vh}>
      <_home>
        <Link to={PUBLIC_GAME} style={{ color: 'white' }}>
          Game
        </Link>
        <Login />
        <Settings />
      </_home>
    </_view>
  );
};

export default Home;
