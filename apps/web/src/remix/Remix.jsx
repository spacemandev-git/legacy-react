import React from 'react';
import { useRemixOrigin } from 'core/hooks/remix/useRemixOrigin';
import { GAME_SCENE } from 'core/remix/state';

const Remix = () => {
  const [game, setGame] = useRemixOrigin(GAME_SCENE, null);

  return null;
};

export default Remix;
