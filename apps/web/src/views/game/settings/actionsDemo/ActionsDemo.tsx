import { PublicKey } from '@solana/web3.js';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Coords,
  Game,
  LegacyClient,
  Location,
  Player,
} from '../../../../../../legacy-program/src/legacy/sdk';
import {
  _create,
  _description,
  _import,
  _login,
  _pubKey,
} from '../Login/Login.styled';
import { PlayerActions } from '@legacy/client';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { BN } from '@project-serum/anchor';

const ActionsDemo = ({
  player,
  playerActions,
  game,
  client,
}: {
  player: Player;
  playerActions: PlayerActions;
  game: Game;
  client: LegacyClient;
}) => {
  const [activeCard, setActiveCard] = useState<Card>();
  const [uninitializedTiles, setUninitializedTiles] = useState<Coords[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const handlePlaceSelection = async (loc: Coords) => {
    if (activeCard) {
      console.log(
        playerActions.playCard(
          localStorage.getItem('gameName'),
          loc,
          activeCard,
        ),
      );
    } else {
      const [locAccount] = await findProgramAddressSync(
        [
          Buffer.from(localStorage.getItem('gameName') || ''),
          new BN(loc.x).toArrayLike(Buffer, 'be', 1),
          new BN(loc.y).toArrayLike(Buffer, 'be', 1),
        ],
        client.program.programId,
      );
      console.log(await client.program.account.location.fetch(locAccount));
    }
  };

  useEffect(() => {
    if (game) {
      console.log(
        'surroundingTiles',
        PlayerActions.getSurroundingTiles(game.locations, game.locations[0]),
      );
      setLocations();
      setUninitializedTiles(
        PlayerActions.getSurroundingTiles(game.locations, game.locations[0]),
      );
    }
  }, [game]);

  return (
    <_login>
      {player ? (
        <>
          <_description>
            Hello {player.name}, you have {player.cards?.length} cards and{' '}
            {player.redeemableCards?.length} reddemable cards.
          </_description>
          {player.cards.map((card: Card) => (
            <_create
              key={card.id.toString()}
              onClick={() => {
                setActiveCard(card.id.toString());
              }}
              $active={activeCard === card.id.toString()}
            >
              ({card.id.toString()}, {card.cardType.toString()},{' '}
              {card.dropTable.toString()})
            </_create>
          ))}
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
          <_description>
            {uninitializedTiles.map((loc: Coords) => (
              <_create
                onClick={() => {
                  // handlePlaceSelection(loc);
                }}
              >
                ({loc.x},{loc.y})
              </_create>
            ))}
          </_description>
        </>
      ) : null}
    </_login>
  );
};

export default ActionsDemo;
