import { Idl, Provider, web3 } from "@project-serum/anchor";

import { TokenConfig } from "..";

export interface SteakingConfig {
  deployer: string;
  tokens: TokenConfig[];
  channel: string;
  programId: string;
  programIdl: Idl;
}

export interface SteakingConfig {
  deployer: string;
  tokens: TokenConfig[];
  channel: string;
  programId: string;
  programIdl: Idl;
}

export interface CreateInstructionFunctionResult<T extends unknown> {
  instructions: web3.TransactionInstruction[];
  cleanupInstructions: web3.TransactionInstruction[];
  signers: web3.Keypair[];
  extra: T;
}

export type CreateInstructionFunction<T, U = unknown> = (
  { provider, config }: { provider: Provider; config?: SteakingConfig },
  args: T,
  overrideConfig?: SteakingConfig
) => Promise<CreateInstructionFunctionResult<U>>;
