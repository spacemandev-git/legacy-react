import { useMemo, useState, useEffect } from 'react';
import { ConfirmOptions, Connection, PublicKey } from '@solana/web3.js';
import { Provider, Program } from '@project-serum/anchor';
import { useRpcNode } from '../contexts/rpcNode';
import mainnetBetaIdl from '../../../libs/chain/legacy_sol.json';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { web3 } from '@project-serum/anchor';
import {
  PlayerActions,
  CardActions,
  UnitActions,
  LegacyClient,
} from '@legacy/client';
import { LOCAL_SECRET } from '../../../libs/chain';
import NodeWallet, { Wallet } from '../../../libs/chain/NodeWallet';

export let idl: any;
const cluster = process.env.REACT_APP_CLUSTER || 'localnet';
if (cluster === 'localnet') {
  // idl = localnetIdl;
  idl = mainnetBetaIdl;
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

const useProvider = (wallet: Wallet) => {
  const { preferredNode } = useRpcNode();
  const connection = useMemo(
    () => new Connection('http://127.0.0.1:8899', 'recent'),
    [preferredNode],
  );
  const confirmOptions = useConfirmOptions();

  return useMemo(() => {
    if (wallet) {
      return new Provider(connection, wallet, confirmOptions as ConfirmOptions);
    }
    return null;
  }, [connection, wallet, confirmOptions]);
};

const useProgram = (wallet?: Wallet) => {
  const provider = useProvider(wallet);
  return useMemo(() => {
    if (provider) {
      return new Program(idl as any, (idl as any).metadata.address, provider);
    }
    return null;
  }, [provider]);
};

export const useClient = (wallet?: Wallet): LegacyClient => {
  const program = useProgram(wallet);
  //TODO: Got type errors on "program" so I cast it as any for now
  return useMemo(() => {
    if (program) {
      return new LegacyClient(program as any);
    }
    return null;
  }, [program]);
};

export const usePlayerActions = (wallet?: Wallet): PlayerActions => {
  const client = useClient(wallet);
  const [playerActions, setPlayerActions] = useState<PlayerActions>(null);

  const handleAction = async () => {
    setPlayerActions(await PlayerActions.load(client, wallet.publicKey));
  };

  useEffect(() => {
    if (wallet) {
      handleAction();
    }
  }, [wallet]);

  return playerActions;
};

export const useLegacyEvents = async (wallet?: Wallet) => {
  const program = useClient(wallet);
  const events = [
    'NewLocationInitalized',
    'TroopsMoved',
    'TroopsDeath',
    'Combat',
    'CardRedeemed',
    'UnitModded',
    'UnitSpawned',
  ];
  const [subIds, setSubIds] = useState([]);
  const setupEventListeners = async () => {
    let sub_ids = [];
    events.forEach((event) => {
      sub_ids.push(
        program.program.addEventListener(event, () => {
          console.log(event, ' called');
        }),
      );
    });
    setSubIds(() => sub_ids);
  };
  const removeEventListeners = async () => {
    subIds.forEach((sub_id) => {
      program.program.removeEventListener(sub_id);
    });
  };

  useMemo(async () => {
    if (program) {
      await removeEventListeners();
      await setupEventListeners();
    }
  }, [program]);

  return [setupEventListeners, removeEventListeners];
};

export const useCardActions = (wallet?: Wallet): CardActions => {
  const client = useClient(wallet);
  const [cardActions, setCardActions] = useState<CardActions>(null);
  const handleAction = async () => {
    setCardActions(await CardActions.load(client, wallet.publicKey));
  };

  useEffect(() => {
    if (wallet) {
      handleAction();
    }
  }, [wallet]);

  return cardActions;
};

export const useUnitActions = (wallet?: Wallet): UnitActions => {
  const client = useClient(wallet);

  return useMemo(() => {
    if (wallet) {
      return UnitActions.load(client, wallet.publicKey);
    }
    return null;
  }, [client, wallet]);
};
