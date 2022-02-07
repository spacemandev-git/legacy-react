import { Transaction } from '@solana/web3.js';

import {
  KNOWN_GENERIC_ERRORS,
  PROGRAMS_ERRORS,
  PROGRAMS_NAMES,
} from './constants';
import { TransactionError } from './TransactionError';

type CustomError = { Custom: number };
type InstructionError = [number, CustomError];

function extractInstructionError(error: any): InstructionError | null {
  const instructionError = `${error}`.split('"InstructionError":').pop();
  if (instructionError) {
    const content = instructionError.substring(
      0,
      instructionError.lastIndexOf(']') + 1,
    );
    return JSON.parse(content);
  }
  return null;
}

export function parseInstructionError(
  transaction: Transaction,
  txId: string,
  transactionError: any,
): TransactionError {
  console.log('TransactionError', transactionError);
  if (`${transactionError}`.includes('Transaction cancelled')) {
    return new TransactionError(
      'Transaction cancelled',
      'TransactionCancelled',
      9999,
      txId,
    );
  }

  if (`${transactionError}`.includes('Transaction was not confirmed')) {
    return new TransactionError(
      'Transaction was not confirmed in 30.00 seconds. It is unknown if it succeeded or failed',
      'TransactionNotConfirmed',
      9998,
      txId,
    );
  }

  try {
    const instructionErrorData =
      transactionError['InstructionError'] ||
      extractInstructionError(transactionError);

    const [failedInstructionIndex, customError] = instructionErrorData;
    const failedInstruction = transaction.instructions[failedInstructionIndex];

    const programErrors =
      PROGRAMS_ERRORS[failedInstruction.programId.toString()];
    const programName =
      PROGRAMS_NAMES[failedInstruction.programId.toString()] ||
      'Unknown program';
    const errorCodeOrName = customError['Custom'] || customError;

    if (programErrors) {
      const errorInfo =
        programErrors.find((i) => i.code == errorCodeOrName) ||
        KNOWN_GENERIC_ERRORS.find((i) => i.code == errorCodeOrName);
      return new TransactionError(
        `${programName}: ${errorInfo?.msg || errorCodeOrName}`,
        errorInfo?.name || 'Unknown',
        errorInfo?.code || errorCodeOrName,
        txId,
      );
    }
    return new TransactionError(
      `${programName}: ${errorCodeOrName}`,
      failedInstruction.programId.toString(),
      errorCodeOrName,
      txId,
    );
  } catch {
    return new TransactionError(
      `${transactionError}`,
      'TransactionError',
      10000,
      txId,
    );
  }
}
