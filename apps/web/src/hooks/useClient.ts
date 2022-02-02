import { useMemo, useState } from 'react';
import { Connection, ConfirmOptions, PublicKey } from '@solana/web3.js';
import { Provider, Program } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRpcNode } from '../contexts/rpcNode';
import mainnetBetaIdl from '../../../libs/chain/legacy_sol.json';
import {
  PlayerActions,
  CardActions,
  UnitActions,
  LegacyClient,
} from '@legacy/client';

export let idl: any;
const cluster = process.env.REACT_APP_CLUSTER;
if (cluster === 'localnet') {
  // idl = localnetIdl;
} else if (cluster === 'devnet') {
  // idl = devnetIdl;
  idl.metadata.cluster = 'https://api.devnet.solana.com/';
} else {
  idl = mainnetBetaIdl;
}

const confirmOptions = {
  skipPreflight: false,
  commitment: 'recent',
  preflightCommitment: 'recent',
};

export const useConfirmOptions = () => {
  return confirmOptions;
};

export const useProvider = () => {
  const { preferredNode } = useRpcNode();
  const connection = useMemo(
    () => new Connection(preferredNode ?? idl.metadata.cluster, 'recent'),
    [preferredNode],
  );
  const wallet = useWallet();
  const confirmOptions = useConfirmOptions();

  return useMemo(
    () => new Provider(connection, wallet as any, confirmOptions),
    [connection, wallet, confirmOptions],
  );
};

export const useProgram = () => {
  const provider = useProvider();
  return useMemo(
    () => new Program(idl as any, (idl as any).metadata.address, provider),
    [provider],
  );
};

export const useClient = (): LegacyClient => {
  const program = useProgram();
  //TODO: Got type errors on "program" so I cast it as any for now
  return useMemo(() => new LegacyClient(program as any), [program]);
};

export const usePlayerActions = (walletAddress?: PublicKey): PlayerActions => {
  const client = useClient();
  const wallet = useWallet();

  return useMemo(() => {
    if (walletAddress) {
      return PlayerActions.load(client, walletAddress);
    } else if (wallet.publicKey) {
      return PlayerActions.load(client, wallet.publicKey);
    }
    return null;
  }, [client, wallet, walletAddress]);
};

export const useCardActions = (walletAddress?: PublicKey): CardActions => {
  const client = useClient();
  const wallet = useWallet();

  return useMemo(() => {
    if (walletAddress) {
      return CardActions.load(client, walletAddress);
    } else if (wallet.publicKey) {
      return CardActions.load(client, wallet.publicKey);
    }
    return null;
  }, [client, wallet, walletAddress]);
};

export const useUnitActions = (walletAddress?: PublicKey): UnitActions => {
  const client = useClient();
  const wallet = useWallet();

  return useMemo(() => {
    if (walletAddress) {
      return UnitActions.load(client, walletAddress);
    } else if (wallet.publicKey) {
      return UnitActions.load(client, wallet.publicKey);
    }
    return null;
  }, [client, wallet, walletAddress]);
};
