import React, { useRef, useEffect, useState } from 'react';
import { _game } from './Game.styled';
import { useSize } from 'core/hooks/useSize';

const Game = () => {
  const game_ref = useRef();
  const { width, height } = useSize(game_ref);

  return <_game ref={game_ref}></_game>;
};

export default Game;
