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
import { PlayerActions, CardActions } from '@legacy/client';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { BN } from '@project-serum/anchor';

const ActionsDemo = ({
  player,
  playerActions,
  cardActions,
  game,
  client,
}: {
  player: Player;
  playerActions: PlayerActions;
  cardActions: CardActions;
  game: Game;
  client: LegacyClient;
}) => {
  const [activeCard, setActiveCard] = useState<Card>();
  const [uninitializedTiles, setUninitializedTiles] = useState<Coords[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeLocation, setActiveLocation] = useState<Location>(null);

  const handlePlaceSelection = async (
    loc: Coords,
    isInitialized: boolean = true,
  ) => {
    if (activeCard) {
      await playerActions.playCard(
        localStorage.getItem('gameName'),
        loc,
        activeCard,
      );
    } else {
      try {
        const [locPubKey] = await findProgramAddressSync(
          [
            Buffer.from(localStorage.getItem('gameName') || ''),
            new BN(loc.x).toArrayLike(Buffer, 'be', 1),
            new BN(loc.y).toArrayLike(Buffer, 'be', 1),
          ],
          client.program.programId,
        );

        if (isInitialized) {
          const locAccount = (await client.program.account.location.fetch(
            locPubKey,
          )) as Location;

          if (
            activeLocation?.coords?.x === locAccount.coords.x &&
            activeLocation?.coords?.y === locAccount.coords.y
          ) {
            setActiveLocation(null);
          } else {
            setActiveLocation(locAccount);
          }
          // if (locAccount.feature.name !== 'blank_space') {
          //   await cardActions.scanForCards(
          //     localStorage.getItem('gameName'),
          //     loc,
          //   );
          //   const [playerAccount] = await findProgramAddressSync(
          //     [
          //       Buffer.from(localStorage.getItem('gameName')),
          //       client.program.provider.wallet.publicKey.toBuffer(),
          //     ],
          //     client.program.programId,
          //   );

          //   const newPlayer = await client.program.account.player.fetch(
          //     playerAccount,
          //   );
          // }
        } else {
          if (activeLocation) {
            await playerActions.initLocBySpawn(
              localStorage.getItem('gameName'),
              loc,
              activeLocation.coords,
            );

            await playerActions.moveTroops(
              localStorage.getItem('gameName'),
              activeLocation.coords,
              loc,
            );
          }
        }
      } catch (_e) {
        console.log(_e);
      }
    }
  };

  useEffect(() => {
    if (game) {
      playerActions
        .getLocationAccounts(localStorage.getItem('gameName'), game.locations)
        .then((locations) => setLocations(locations));
      setUninitializedTiles(PlayerActions.getSurroundingTiles(game.locations));
    }
  }, [game]);

  return (
    <_login>
      {player ? (
        <>
          <_description>
            Hello {player.name}, you have {player.cards?.length} cards and{' '}
            {player.redeemableCards?.length} redeemable cards.
          </_description>
          {player.cards.map((card: Card) => (
            <_create
              key={card.id.toString()}
              onClick={() => {
                setActiveCard(card.id.toString());
              }}
              $active={activeCard === card.id.toString()}
            >
              ({card.id.toString()},{' '}
              {card.cardType?.unit?.unit?.name ||
                card.cardType?.unitMod?.umod?.name}
              , {Object.getOwnPropertyNames(card.dropTable)?.[0]})
            </_create>
          ))}
        </>
      ) : null}
      {game ? (
        <>
          <_description>Tiles:</_description>
          {locations
            ?.concat(uninitializedTiles)
            .sort((first, second) => {
              const castedFirst = (first.coords || first) as Coords;
              const castedSecond = (second.coords || second) as Coords;

              if (castedFirst.y === castedSecond.y) {
                return castedFirst.x - castedSecond.x;
              } else {
                return castedFirst.y - castedSecond.y;
              }
            })
            ?.map((loc: Location | Coords) => {
              const castedLocation = loc as Location;
              const castedCoords = loc as Coords;
              if (castedLocation.gameAcc) {
                return (
                  <>
                    {castedLocation.coords.y !== 0 &&
                    castedLocation.coords.x === 0 ? (
                      <br />
                    ) : null}
                    <_create
                      key={castedLocation.coords.x + castedLocation.coords.y}
                      onClick={() => {
                        handlePlaceSelection(castedLocation.coords);
                      }}
                      style={{ width: 100, height: 80, marginBottom: 16 }}
                      $taken={castedLocation.tileOwner}
                      $active={
                        activeLocation?.coords?.x === castedLocation.coords.x &&
                        activeLocation?.coords?.y === castedLocation.coords.y
                      }
                    >
                      ({castedLocation.coords.x},{castedLocation.coords.y})
                      {castedLocation.troops
                        ? `(${castedLocation.troops.name})`
                        : null}
                    </_create>
                  </>
                );
              } else {
                return (
                  <>
                    {castedCoords.y !== 0 && castedCoords.x === 0 ? (
                      <br />
                    ) : null}
                    <_create
                      onClick={() => {
                        handlePlaceSelection(castedCoords, false);
                      }}
                      style={{ width: 100, height: 80, marginBottom: 16 }}
                      $unInit
                    >
                      ({castedCoords.x},{castedCoords.y})
                    </_create>
                  </>
                );
              }
            })}
        </>
      ) : null}
    </_login>
  );
};

export default ActionsDemo;
