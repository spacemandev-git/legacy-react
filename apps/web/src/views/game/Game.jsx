import React, { useRef } from 'react';
import { _game } from './Game.styled';
import { useSize } from 'core/hooks/useSize';
import Map from './map/Map';

const Game = () => {
  const game_ref = useRef();
  const { width, height } = useSize(game_ref);

  return (
    <_game ref={game_ref}>
      {width && height && <Map width={width} height={height} />}
    </_game>
  );
};

export default Game;
