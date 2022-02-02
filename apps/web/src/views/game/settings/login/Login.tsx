import React, { useEffect, useState } from 'react';
import {
  _create,
  _description,
  _import,
  _login,
  _pubKey,
} from './Login.styled';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { PublicKey } from '@solana/web3.js';
import { createLocalWallet, LOCAL_SECRET } from '../../../../../../libs/chain';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import ActionsDemo from '../actionsDemo/ActionsDemo';
import {
  useUnitActions,
  useClient,
  useCardActions,
  usePlayerActions,
} from '../../../../hooks/useClient';

const Login = () => {
  const [pubKey, setPubKey] = useState();
  const [value, setValue] = useState('');
  const [provider, setProvider] = useState();
  const [program, setProgram] = useState();
  const [playerMissing, setPlayerMissing] = useState(false);
  const [optionSelected, setOptionSelected] = useState('');
  const [player, setPlayer] = useState();
  const [game, setGame] = useState();
  const client = useClient();
  const playerActions = usePlayerActions();
  const unitActions = useUnitActions();
  const cardActions = useCardActions();
  const handleCreateBurner = async () => {
    setup();
  };

  useEffect(() => {
    const pubKey = localStorage.getItem(LOCAL_SECRET);
    if (pubKey) setPubKey(pubKey);
  }, []);

  const setup = async () => {
    const { wallet, provider, program } = await createLocalWallet();
    setProgram(program);
    setProvider(provider);
    setPubKey(new PublicKey(wallet.publicKey).toBase58());
  };

  const handleImportKey = (e) => {
    if (e.key === 'Enter') {
      localStorage.setItem(LOCAL_SECRET, bs58.encode(value));
      setup();
    }
  };

  useEffect(() => {
    if (pubKey) {
      checkPlayerExists();
    }
  }, [pubKey]);

  const checkPlayerExists = async () => {
    let player;
    try {
      const [playerAccount] = await findProgramAddressSync(
        [
          Buffer.from(localStorage.getItem('gameName')),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId,
      );
      player = await program.account.player.fetch(playerAccount);
      setPlayer(player);

      setGame(await client.getGameAccount(localStorage.getItem('gameName')));
      console.log(player);
    } catch (_error) {
      if (!player) {
        setPlayerMissing(true);
      }
    }
  };

  const handlePlayerInitialize = async () => {
    player
      .initializePlayer(
        localStorage.getItem('gameName'),
        provider.wallet.publicKey.toString(),
      )
      .then((obj) => {
        console.log('!DONE', obj);
      });
  };

  const handleSelection = (selection) => {
    setOptionSelected(selection);
  };

  useEffect(() => {
    console.log(game);
  }, [game]);

  return (
    <_login>
      <h2 style={{ marginBottom: '16px' }}>Welcome to Legacy SOL</h2>
      {!optionSelected ? (
        <>
          <_create
            onClick={() => {
              handleCreateBurner();
              handleSelection('signin');
            }}
          >
            {pubKey ? 'Sign in to existing account' : 'Create burner account'}
          </_create>
          <_create disabled>Import private key</_create>
        </>
      ) : null}
      {optionSelected === 'import' ? (
        // Needs more work, will be disabled for now
        <_import
          placeholder="Import private key"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyDown={handleImportKey}
        />
      ) : null}
      {optionSelected === 'signin' ? (
        <>
          {pubKey && playerMissing && !player ? (
            <>
              <_description>
                It looks like you havent made an account for this game session
                <br />
                {/* TODO: remove */}
                (pubKey: {pubKey})
              </_description>
              <_create onClick={handlePlayerInitialize}>
                Initialize account
              </_create>
            </>
          ) : null}
          {player ? (
            <>
              <_description>You are signed in!</_description>
              <ActionsDemo player={player} game={game} legacy={client} />
            </>
          ) : null}
          {}
        </>
      ) : null}
    </_login>
  );
};

export default Login;
