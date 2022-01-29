import React from 'react';
import { useRemix } from 'core/hooks/remix/useRemix';
import { GAME_TEST } from 'core/remix/state';
import { subscriber } from 'web/client';

const CardProps = (scene) => {
  const setState = (next_state) => {
    subscriber.next(next_state);
  };

  scene.prototype.props = {
    setState,
  };

  return scene;
};

export default CardProps;
