import React from 'react';
import { _home } from './Home.styled';
import { Link } from 'react-router-dom';
import { PUBLIC_GAME } from 'core/routes/routes';

const Home = () => {
  return (
    <_home>
      <Link to={PUBLIC_GAME}>Game</Link>
    </_home>
  );
};

export default Home;
