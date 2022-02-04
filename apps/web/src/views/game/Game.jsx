import { useRef, useEffect } from 'react';
import { _game } from './Game.styled';
import { useSize } from 'core/hooks/useSize';

import Phaser from 'phaser';
import { MapScene } from '../../views/game/scenes/MapScene';
import { CardScene } from '../../views/game/scenes/CardScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  parent: 'phaser-example',
  pixelArt: true,
  scene: [MapScene, CardScene],
};

const Game = () => {
  useEffect(() => {
    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return null;
};

export default Game;
