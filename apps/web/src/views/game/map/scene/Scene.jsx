import React, { useRef } from 'react';
import { Canvas } from 'react-three-fiber';
import { Flex, Box, useReflow } from '@react-three/flex';
import Tile from '../tile/Tile';

export function Scene({ isFullscreen }) {
  const group_ref = useRef();
  // const { size } = useThree();
  // const [vpWidth, vpHeight] = useAspect(size.width, size.height);
  // const three = useThree();

  const row = () => {
    let tile_row = [];
    for (let i = 0; i < 9; i++) {
      // tile_row[i] = <Tile/>
    }

    return <_row></_row>;
  };

  const tiles = () => {
    let row = [];
  };

  return (
    <Canvas gl={{ alpha: false }} camera={{ position: [0, 0, 2], zoom: 1 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <group ref={group_ref}>
        <Flex
          direction="row"
          size={[600, 600, 0]}
          justify="center"
          alignItems="center"
        >
          <Tile size={[0.2, 1, 1]} position={[0, 0, 0]} />
          {/*<Tile size={[0.2,1,1]} position={[1, 0, 0]}/>*/}
          {/*<Tile size={[0.2,1,1]} position={[1.5, 0, 0]}/>*/}
          {/*<Tile size={[0.2,1,1]} position={[2, 0, 0]}/>*/}
          <Box margin={2} />
        </Flex>
      </group>
    </Canvas>
  );
}

//
// function Reflower() {
//     const reflow = useReflow();
//     useFrame(reflow);
//     return null;
// }
