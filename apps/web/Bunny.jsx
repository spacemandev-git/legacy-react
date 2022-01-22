import React from 'react';
import { Sprite, Stage } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';
import chest from 'design/assets/Chest1.png';

function Chest(props) {
  return <Sprite texture={PIXI.Texture.from(chest)} {...props} />;
}

const Bunny = () => {
  return (
    <Stage options={{ backgroundColor: 0x10bb99, height: 1000, width: 1000 }}>
      <Chest width={100} height={100} />
    </Stage>
  );
};

export default Bunny;
