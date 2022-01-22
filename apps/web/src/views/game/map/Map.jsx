import React, { useMemo } from 'react';
import { _map, _row } from './Map.styled';
import { Scene } from './scene/Scene';

const Map = () => {
  // const row = useMemo(() => {
  // 	const row_tiles = [];
  // 	const max_tiles = 10;
  // 	for(let i = 0; i < max_tiles - 1; i++) {
  // 		row_tiles[i] = <Tile width={50} height={50}/>
  // 	}
  // 	return <_row>{row_tiles}</_row>;
  // },[]);
  //
  // const test1 = [<div/>, <div/>];
  // const test2 = [<div/>, <div/>]
  // const arr = [test1, test2]

  return (
    <_map>
      <Scene />
    </_map>
  );
};

export default Map;
