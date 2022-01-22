import React, { useRef, useLayoutEffect, useMemo, useEffect } from 'react';
import { _tiles } from './Tiles.styled';
import { Sprite, Stage } from 'react-pixi-fiber';
import { CompositeTilemap } from '@pixi/tilemap';
import * as PIXI from 'pixi.js';
import chest from 'design/assets/Chest1.png';
import { useSize } from 'core/hooks/useSize';
import { Loader } from '@pixi/loaders';

const Tiles = ({ width, height }) => {
  const tiles_ref = useRef();

  let app = useMemo(() => {
    if (width && height) {
      return new PIXI.Application({
        antialias: true,
        autoDensity: true,
        backgroundColor: 0x10bb99,
        resolution: window?.devicePixelRatio || 1,
        height: 600,
        width: 600,
      });
    }
  }, [width, height]);

  //main container, use this to render everything.
  let stage;
  let tilemap;
  let frame = 0;

  const loader = new PIXI.Loader();

  // if (app) loader.add('button', 'design/assets/Chest1.png');

  const map = useMemo(() => {
    if (app) {
      // stage = new PIXI.Container();

      const tilemap = new CompositeTilemap();

      // Render your first tile at (0, 0)!
      tilemap.tile(chest, 0, 0);

      // Setup rendering loop
      // PIXI.Ticker.shared.add(() => app.render(stage));
    }
  }, [app]);

  if (app) loader.load(map);

  function makeTilemap() {
    // Clear the tilemap, in case it is being reused.
    tilemap.clear();

    const resources = loader.resources;
    const size = 32;

    // Calculate the dimensions of the tilemap to build
    const pxW = app.screen.width;
    const pxH = app.screen.height;
    const tileW = pxW / size;
    const tileH = pxH / size;
    const wallBoundary = 2 + Math.floor(tileH / 2);

    // Fill the scene with grass and sparse rocks on top and chests on
    // the bottom. Some chests are animated between two tile textures
    // (so they flash red).
    for (let i = 0; i < tileW; i++) {
      for (let j = 0; j < tileH; j++) {
        tilemap.tile(
          j < tileH / 2 && i % 2 === 1 && j % 2 === 1
            ? 'tough.png'
            : 'grass.png',
          i * size,
          j * size,
        );

        if (j === wallBoundary) {
          tilemap.tile('brick_wall.png', i * size, j * size);
        } else if (j > wallBoundary + 1 && j < tileH - 1) {
          if (Math.random() > 0.8) {
            tilemap.tile('chest.png', i * size, j * size);

            if (Math.random() > 0.8) {
              // Animate between 2 tile textures. The x-offset
              // between them in the base-texture is 34px, i.e.
              // "red_chest" is exactly 34 pixels right in the atlas.
              tilemap.tileAnimX(34, 2);
            }
          }
        }
      }
    }

    // Button does not appear in the atlas, but @pixi/tilemap won't surrender
    // - it will create second layer for special for buttons and they will
    // appear above all the other tiles.
    // tilemap.tile(resources.button.texture, 0, 0);
  }

  useLayoutEffect(() => {
    if (tiles_ref && app) tiles_ref.current.appendChild(app.view);
    if (app) app.start();

    return () => {
      // On unload stop the application
      // if (app) app.stop();
    };
  }, [tiles_ref]);

  useEffect(() => {}, [width, height]);

  return (
    <_tiles ref={tiles_ref}>
      {/*<Stage options={{ backgroundColor: 0x10bb99, height: 1000, width: 1000 }}>*/}
      {/*	<Chest width={100} height={100} />*/}
      {/*</Stage>*/}
    </_tiles>
  );
};

export default Tiles;
