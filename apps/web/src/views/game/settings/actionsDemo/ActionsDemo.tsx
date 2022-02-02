import { Game } from 'phaser';
import React, { useEffect } from 'react';
import {
  Coords,
  LegacyProgram,
  Player,
} from '../../../../../../legacy-program/src/legacy/sdk';
import { PlayerMovement } from '../../../../../../legacy-program/src/legacy/sdk/Player';
import {
  _create,
  _description,
  _import,
  _login,
  _pubKey,
} from '../Login/Login.styled';

const ActionsDemo = ({
  player,
  game,
  legacy,
}: {
  player: Player;
  game: any;
  legacy: LegacyProgram;
}) => {
  const handlePlaceSelection = (loc: Coords) => {
    legacy.playerMovement.initLocBySpawn(localStorage.getItem('gameName'), loc);
  };

  return (
    <_login>
      {player ? (
        <>
          <_description>
            Hello {player.name}, you have {player.cards?.length} cards!!! and{' '}
            {player.redeemableCards?.length}
            reddemable cards.
          </_description>
        </>
      ) : null}
      {game ? (
        <>
          <_description>Available tiles:</_description>
          <_description>
            {game.locations.map((loc: Coords) => (
              <_create
                onClick={() => {
                  handlePlaceSelection(loc);
                }}
              >
                ({loc.x},{loc.y})
              </_create>
            ))}
          </_description>
          <_description>Occupied tiles:</_description>
          <_description>Uninitialized tiles:</_description>
        </>
      ) : null}
    </_login>
  );
};

export default ActionsDemo;
