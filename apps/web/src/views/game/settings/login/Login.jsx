import React, { useState } from 'react';
import { web3 } from '@project-serum/anchor';
import { _create, _import, _login, _pubKey } from './Login.styled';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { PublicKey } from '@solana/web3.js';

const Login = () => {
  const [pubKey, setPubKey] = useState();
  const [value, setValue] = useState('');

  const handleCreateBurner = () => {
    let keypair = web3.Keypair.generate();
    console.log(keypair);

    localStorage.setItem('secretKey', bs58.encode(keypair.secretKey));
    localStorage.setItem('pubKey', new PublicKey(keypair.publicKey).toBase58());
    setPubKey(new PublicKey(keypair.publicKey).toBase58());
  };

  const handleImportKey = (e) => {
    if (e.key === 'Enter') {
      let keypair = web3.Keypair.fromSecretKey(bs58.decode(value));

      localStorage.setItem('secretKey', bs58.encode(keypair.secretKey));
      localStorage.setItem(
        'pubKey',
        new PublicKey(keypair.publicKey).toBase58(),
      );
      setPubKey(new PublicKey(keypair.publicKey).toBase58());
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
