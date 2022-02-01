import { Idl, Provider, web3 } from '@project-serum/anchor';

export interface LegacyConfig {
  deployer: string;
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
  { provider, config }: { provider: Provider; config?: LegacyConfig },
  args: T,
  overrideConfig?: LegacyConfig,
) => Promise<CreateInstructionFunctionResult<U>>;
