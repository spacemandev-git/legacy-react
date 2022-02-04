import React from 'react';
import { useRemix } from 'core/hooks/remix/useRemix';
import { GAME_TEST } from 'core/remix/state';
import { subscriber } from 'web/client';

const MapProps = (scene) => {
  const setState = (next_state) => {
    subscriber.next(next_state);
  };

  const initPlayer = () => {
    // Call some stuff

    setState({ ...state });
  };

  scene.prototype.props = {
    setState,
  };

  return scene;
};

export default MapProps;
