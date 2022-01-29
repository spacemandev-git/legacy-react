import React from 'react';
import { useRemixOrigin } from 'core/hooks/remix/useRemixOrigin';
import { GAME_SCENE, GAME_TEST } from 'core/remix/state';

const Remix = () => {
  const [game, setGame] = useRemixOrigin(GAME_TEST, false);

  return null;
};

export default Remix;
