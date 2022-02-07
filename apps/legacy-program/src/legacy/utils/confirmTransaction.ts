import { Provider, web3 } from "@project-serum/anchor";

import { parseInstructionError } from "../errors";

export const confirmTransaction = async (
  provider: Provider,
  txId: string,
  transaction: web3.Transaction,
  commitment: web3.Commitment = "confirmed"
) => {
  const res = await provider.connection.confirmTransaction(txId, commitment);

  if (res?.value?.err) {
    throw parseInstructionError(transaction, txId, res.value.err);
  }
  return txId;
};
