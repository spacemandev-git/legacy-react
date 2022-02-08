import { createContext, useContext, useEffect, useState } from 'react';
import { useProvider } from '../hooks/useClient';

// RPC node context
interface RpcNode {
  preferredNode: string | null;
  setPreferredNode: (url: string | null) => void;
  ping: number;
  setPing: (ping: number) => void;
}
const RpcNodeContext = createContext<RpcNode>({
  preferredNode: null,
  setPreferredNode: () => {},
  ping: 0,
  setPing: () => {},
});

// RPC node context provider
export function RpcNodeContextProvider(props: { children: any }) {
  const [preferredNode, setPreferredNode] = useState(
    localStorage.getItem('legacyPreferredNode') ?? null,
  );

  const [ping, setPing] = useState(0);

  // Update ping whenever connection changes
  const { connection } = useProvider('');
  useEffect(() => {
    const getPing = async () => {
      const startTime = Date.now();
      await connection.getGenesisHash();
      const endTime = Date.now();
      setPing(endTime - startTime);
    };

    getPing();
  }, [connection]);

  return (
    <RpcNodeContext.Provider
      value={{
        preferredNode,
        setPreferredNode,
        ping,
        setPing,
      }}
    >
      {props.children}
    </RpcNodeContext.Provider>
  );
}

// RPC node hook
export const useRpcNode = () => {
  const { preferredNode, setPreferredNode, ping, setPing } = useContext(
    RpcNodeContext,
  );
  return {
    preferredNode,
    setPreferredNode,
    ping,
    setPing,
    updateRpcNode: (rpcNodeInput?: string) => {
      // TODO: Will this update useProvider without being a dependency?
      if (rpcNodeInput) {
        localStorage.setItem('legacyPreferredNode', 'http://127.0.0.1:8899');
        setPreferredNode(rpcNodeInput);
      } else {
        localStorage.removeItem('legacyPreferredNode');
        setPreferredNode(null);
      }

      setPing(0);
    },
  };
};
