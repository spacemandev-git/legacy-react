import React, { useState } from 'react';
import { _create, _import, _login, _pubKey } from './Login.styled';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { PublicKey } from '@solana/web3.js';
import { createLocalWallet } from '../../../../../../libs/chain';

const Login = () => {
  const [pubKey, setPubKey] = useState();
  const [value, setValue] = useState('');

  const handleCreateBurner = async () => {
    const { wallet } = await createLocalWallet();
    console.log(wallet);
    setPubKey(new PublicKey(wallet?.publicKey).toBase58());
  };

  const handleImportKey = (e) => {
    if (e.key === 'Enter') {
      localStorage.setItem(LOCAL_SECRET, bs58.encode(value));
      const { wallet } = createLocalWallet();
      setPubKey(new PublicKey(wallet.publicKey).toBase58());
    }
  };

  return (
    <_login>
      <h1>Welcome to Legacy SOL</h1>
      <_import
        placeholder="Import private key"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyDown={handleImportKey}
      />
      or
      <_create onClick={handleCreateBurner}>Create burner account</_create>
      {pubKey ? <_pubKey>{pubKey}</_pubKey> : null}
    </_login>
  );
};

export default Login;
