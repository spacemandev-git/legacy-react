import React, { useRef, useState, useLayoutEffect } from 'react';
import { useFrame } from 'react-three-fiber';
import { Box } from '@react-three/flex';

const Tile = ({ position, size }) => {
  const position_x = position?.[0];
  const position_y = position?.[1];
  const position_z = position?.[2];

  const size_width = size?.[0];
  const size_height = size?.[1];
  const size_depth = size?.[2];

  const ref = useRef();
  // useFrame((state, delta) => {
  //     return (ref.current.rotation.x += 0.01)
  // })
  const [hover, setHover] = useState(false);

  useLayoutEffect(() => {
    if (ref.current) {
      console.log(ref.current);
      const shape = ref.current;
      shape.position.x = position_x;
      shape.position.y = position_y;
      shape.position.z = position_z;
      shape.rotation.x = 0;
      shape.rotation.y = 3;
      shape.rotation.z = 0;
      shape.receiveShadow = true;
    }
  }, []);

  return (
    // <mesh
    //     ref={ref}
    //     scale={1}
    //     onPointerOver={() => setHover(true)}
    //     onPointerOut={() => setHover(false)}>>
    //     <boxGeometry args={[size_width, size_height, size_depth]} />
    //     <meshStandardMaterial color={hover ? 'hotpink' : 'orange'} />
    // </mesh>
    // <Box>
    //     <mesh position={[0.3 / 2, -0.3 / 2, 0]} onPointerOver={() => setHover(true)}
    //             onPointerOut={() => setHover(false)}>
    //         <planeBufferGeometry args={[0.3, 0.3]} />
    //         <meshStandardMaterial color={hover ? 'hotpink' : 'orange'}/>
    //     </mesh>
    // </Box>
    <Box flexDirection="row" flexWrap="wrap" width={2} flexGrow={1}>
      {new Array(8).fill(0).map((k, i) => (
        <Box margin={0.05} key={i}>
          <mesh position={[0.3 / 2, -0.3 / 2, 0]}>
            <planeBufferGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial />
          </mesh>
        </Box>
      ))}
    </Box>
  );
};

export default Tile;
