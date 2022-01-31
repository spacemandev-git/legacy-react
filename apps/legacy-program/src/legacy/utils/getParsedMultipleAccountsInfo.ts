import { web3 } from "@project-serum/anchor";

/**
 * Fetch all the account info for multiple accounts specified by an array of public keys
 */
export async function getParsedMultipleAccountsInfo<T>(
  connection: web3.Connection,
  publicKeys: web3.PublicKey[],
  commitment: web3.Commitment = "recent"
): Promise<Array<null | web3.AccountInfo<T>>> {
  const args = [
    publicKeys.map((k) => k.toBase58()),
    { commitment, encoding: "jsonParsed" },
  ];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const res = await connection._rpcRequest("getMultipleAccounts", args);
  if (res.error) {
    throw new Error(
      "failed to get info about accounts " +
        publicKeys.map((k) => k.toBase58()).join(", ") +
        ": " +
        res.error.message
    );
  }
  console.log(res.result);
  console.log("result");
  return res.result.value.map(
    (x: web3.AccountInfo<web3.ParsedAccountData>) => ({
      ...x,
      data: x.data.parsed as T,
    })
  );
}
