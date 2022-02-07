import * as anchor from '@project-serum/anchor';
import NodeWallet from './NodeWallet';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import legacySOLIDL from './legacy_sol.json';

export const LOCAL_SECRET = 'LOCAL_SECRET';

export const createLocalWallet = async () => {
  // connect anchor
  const conn = new anchor.web3.Connection('http://127.0.0.1:8899');

  // generate a local wallet
  let secret;
  let wallet;
  let local_secret = localStorage.getItem(LOCAL_SECRET);

  // use same wallet from localstorage
  if (local_secret) {
    secret = local_secret;
    wallet = anchor.web3.Keypair.fromSecretKey(bs58.decode(secret));
  } else {
    // request airdrop
    wallet = anchor.web3.Keypair.generate();
    localStorage.setItem(
      LOCAL_SECRET,
      bs58.encode(wallet?._keypair?.secretKey),
    );
    // airdropping not working
    await conn.requestAirdrop(wallet.publicKey, 100);
  }

  const { program, provider } = getProgram(conn, wallet);

  return { conn, wallet, program, provider };
};

export const getProgram = (conn, wallet) => {
  const _provider = new anchor.Provider(conn, new NodeWallet(wallet), {});
  return {
    program: new anchor.Program(
      legacySOLIDL,
      'Cz4TVYSDxwobuiKdtZY8ejp3hWL7WfCbPNYGUqnNBVSe',
      _provider,
    ),
    provider: _provider,
  };
};
