import { PublicKey } from '@solana/web3.js';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Coords,
  Game,
  LegacyClient,
  Location,
  Player,
} from '@legacy/client';
import {
  _create,
  _description,
  _import,
  _login,
  _pubKey,
  _title,
} from '../Login/Login.styled';
import { PlayerActions, CardActions } from '@legacy/client';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { BN } from '@project-serum/anchor';
import { Wallet } from '../../../../../../libs/chain/NodeWallet';
import usePrevious from '../../../../hooks/usePrevious';
// import { useLegacyEvents } from '../../../../hooks/useClient';

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
  // const [uninitializedTiles, setUninitializedTiles] = useState<Coords[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeLocation, setActiveLocation] = useState<Coords>();
  const prevActiveLocation = usePrevious(activeLocation);

  const [targetTile, setTargetTile] = useState<Coords>(0);
  const [playerAccount, setPlayerAccount] = useState<PublicKey>();
  const [playerLocations, setPlayerLocations] = useState<Location[]>([]);

  // const legacyEvents = useLegacyEvents();
  useEffect(async () => {
    const [playerAccount] = await findProgramAddressSync(
      [
        Buffer.from(localStorage.getItem('gameName') || ''),
        client.program.provider.wallet.publicKey.toBuffer(),
      ],
      client.program.programId,
    );
    setPlayerAccount(() => playerAccount);
  }, [client]);

  useEffect(() => {
    if (game) {
      playerActions
        .getLocationAccounts(localStorage.getItem('gameName'), game.locations)
        .then((locations) => {
          setLocations(() => locations);
        });
    }
  }, [game]);

  useEffect(() => {
    if (playerAccount) {
      const playerLocations = locations.filter(
        (location) =>
          playerAccount?.toBase58() === location.tileOwner?.toBase58(),
      );
      setPlayerLocations(() => playerLocations);
    }
  }, [locations]);
  const handlePlaceSelection = async (
    loc: Coords,
    isInitialized: boolean = true,
  ) => {
    if (activeCard) {
      console.log('playing card');
      await playerActions.playCard(
        localStorage.getItem('gameName'),
        loc,
        activeCard,
      );
    } else {
      try {
        if (activeLocation && prevActiveLocation) {
          // console.log('init location by spawn');
          // await playerActions.initLocBySpawn(
          //   localStorage.getItem('gameName'),
          //   prevActiveLocation,
          //   activeLocation,
          // );
          console.log('Move Troop');
          await playerActions.moveTroops(
            localStorage.getItem('gameName'),
            prevActiveLocation,
            activeLocation,
          );
        }
      } catch (_e) {
        console.log(_e);
      }
    }
  };

  const RenderTiles = () => {
    return (
      <>
        {locations
          .sort((first, second) => {
            const castedFirst = first.coords as Coords;
            const castedSecond = second.coords as Coords;

            if (castedFirst.y === castedSecond.y) {
              return castedFirst.x - castedSecond.x;
            } else {
              return castedFirst.y - castedSecond.y;
            }
          })
          ?.map((loc: Location) => {
            const castedLocation = loc as Location;

            if (castedLocation.gameAcc) {
              // Render intialized tiles
              return (
                <>
                  {castedLocation.coords.y !== 0 &&
                  castedLocation.coords.x === 0 ? (
                    <br />
                  ) : null}

                  <_create
                    key={castedLocation.coords.x + castedLocation.coords.y}
                    onClick={() => {
                      setActiveLocation(() => castedLocation.coords);
                      // setTargetTile(() => castedLocation.coords);
                      // handlePlaceSelection(castedLocation.coords);
                    }}
                    style={{ width: 100, height: 80, marginBottom: 16 }}
                    $taken={castedLocation.tileOwner}
                    $active={
                      activeLocation?.x === castedLocation.coords.x &&
                      activeLocation?.y === castedLocation.coords.y
                    }
                    $userOwned={
                      playerAccount &&
                      playerAccount?.toBase58() ===
                        castedLocation.tileOwner?.toBase58()
                      //   : false
                    }
                  >
                    ({castedLocation.coords.x},{castedLocation.coords.y})
                    {castedLocation.troops
                      ? `(${castedLocation.troops.name})`
                      : null}
                    {castedLocation?.tileOwner
                      ? castedLocation?.tileOwner?.toBase58()
                      : 'none'}
                  </_create>
                </>
              );
            } else {
              // Render unintialized tiles
              return (
                <>
                  {castedLocation.coords.y !== 0 &&
                  castedLocation.coords.x === 0 ? (
                    <br />
                  ) : null}
                  <_create
                    onClick={() => {
                      // setTargetTile(() => castedLocation.coords);
                      setActiveLocation(() => castedLocation.coords);
                      // handlePlaceSelection(castedCoords, false);
                    }}
                    style={{ width: 100, height: 80, marginBottom: 16 }}
                    $unInit
                  >
                    ({castedLocation.coords.x},{castedLocation.coords.y})
                  </_create>
                </>
              );
            }
          })}
      </>
    );
  };
  const handleAttack = async (from: Coords, to: Coords) => {
    console.log('Starting Attack');
    const playerLocation = await playerActions.getLocationAccounts(
      localStorage.getItem('gameName'),
      [from],
    );
    console.log('tileAttacking: ', playerLocation);
    const tileGettingAttacked = await playerActions.getLocationAccounts(
      localStorage.getItem('gameName'),
      [to],
    );
    console.log('tileGettingAttacked: ', tileGettingAttacked);
    await playerActions.attack(
      localStorage.getItem('gameName'),
      activeLocation,
      to,
    );
    console.log('---Attack Happened---');
    const _playerLocation = await playerActions.getLocationAccounts(
      localStorage.getItem('gameName'),
      [from],
    );
    console.log('_playLocation: ', _playerLocation);
    const _tileAttacked = await playerActions.getLocationAccounts(
      localStorage.getItem('gameName'),
      [to],
    );
    console.log('_tileAttacked: ', _tileAttacked);
  };

  const RenderActions = () => {
    return (
      <>
        <_create onClick={() => handlePlaceSelection(activeLocation)}>
          Move Troop
        </_create>
        <_create onClick={() => handleAttack(activeLocation, targetTile)}>
          Attack
        </_create>
      </>
    );
  };

  const PlayerOwnedCards = () => {
    return (
      <>
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
    );
  };

  return (
    <_login>
      {player ? (
        <>
          <_description>
            Hello {player.name}, you have {player.cards?.length} cards and{' '}
            {player.redeemableCards?.length} reddemable cards.
          </_description>
          <PlayerOwnedCards />
        </>
      ) : null}
      {!activeCard && <_description>Select a tile to see actions</_description>}

      {game ? (
        <>
          <_description>Tiles:</_description>
          <RenderTiles />
        </>
      ) : null}
      <br />
      {activeLocation && <_title>ACTIONS</_title>}

      {activeLocation && <RenderActions />}
    </_login>
  );
};

export default ActionsDemo;
