import React, { useEffect, useState } from 'react';
import {
  _create,
  _description,
  _import,
  _login,
  _pubKey,
} from './Login.styled';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { LOCAL_SECRET } from '../../../../../../libs/chain';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import ActionsDemo from '../actionsDemo/ActionsDemo';
import {
  useUnitActions,
  useClient,
  useCardActions,
  usePlayerActions,
} from '../../../../hooks/useClient';
import { web3 } from '@project-serum/anchor';
import NodeWallet, { Wallet } from '../../../../../../libs/chain/NodeWallet';

const Login = () => {
  const [value, setValue] = useState('');
  const [playerMissing, setPlayerMissing] = useState(false);
  const [optionSelected, setOptionSelected] = useState('');
  const [player, setPlayer] = useState();
  const [game, setGame] = useState();
  const [wallet, setWallet] = useState<Wallet>();
  const client = useClient(wallet);
  const playerActions = usePlayerActions(wallet);
  const unitActions = useUnitActions(wallet);
  const cardActions = useCardActions(wallet);

  const handleCreateBurner = async () => {
    let secret;
    let wallet;
    let local_secret = localStorage.getItem(LOCAL_SECRET);

    if (local_secret) {
      wallet = web3.Keypair.fromSecretKey(bs58.decode(local_secret));
    } else {
      wallet = web3.Keypair.generate();
      localStorage.setItem(
        LOCAL_SECRET,
        bs58.encode(wallet?._keypair?.secretKey),
      );
    }
    setWallet(new NodeWallet(wallet));
  };

  const handleImportKey = (e) => {
    if (e.key === 'Enter') {
      localStorage.setItem(LOCAL_SECRET, bs58.encode(value));
    }
  };

  useEffect(() => {
    if (wallet) {
      checkPlayerExists();
    }
  }, [wallet]);

  const checkPlayerExists = async () => {
    let player;
    try {
      if (client) {
        const [playerAccount] = await findProgramAddressSync(
          [
            Buffer.from(localStorage.getItem('gameName')),
            client.program.provider.wallet.publicKey.toBuffer(),
          ],
          client.program.programId,
        );

        const [gamePubKey] = await findProgramAddressSync(
          [Buffer.from(localStorage.getItem('gameName'))],
          client.program.programId,
        );
        player = await client.program.account.player.fetch(playerAccount);
        setPlayer(player);

        setGame(await client.getGameAccount(localStorage.getItem('gameName')));
      }
    } catch (_error) {
      if (!player) {
        setPlayerMissing(true);
      }
    }
  };

  const handlePlayerInitialize = async () => {
    playerActions
      .initializePlayer(
        localStorage.getItem('gameName'),
        client.program.provider.wallet.publicKey.toString(),
      )
      .then((obj) => {
        console.log('!DONE', obj);
        checkPlayerExists();
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
            {wallet ? 'Sign in to existing account' : 'Create burner account'}
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
      {optionSelected === 'signin' || wallet ? (
        <>
          {wallet && playerMissing && !player ? (
            <>
              <_description>
                It looks like you havent made an account for this game session
                <br />
                (pubKey: {wallet.publicKey.toBase58()})
              </_description>
              <_create onClick={handlePlayerInitialize}>
                Initialize account
              </_create>
            </>
          ) : null}
          {wallet && player ? (
            <>
              <_description>You are signed in!</_description>
              <ActionsDemo
                player={player}
                game={game}
                playerActions={playerActions}
                cardActions={cardActions}
                client={client}
              />
            </>
          ) : null}
          {}
        </>
      ) : null}
    </_login>
  );
};

export default Login;
