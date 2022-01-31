/* eslint-disable @typescript-eslint/no-unused-vars */
import { web3 } from '@project-serum/anchor';
import { LEGACY_PROGRAM_ID } from '../sdk/constants';
import assert from 'assert';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import { Feature } from '../sdk';
import { CreateInstructionFunction } from './type';
import { UnitMod } from '..';
import { SystemProgram } from '@solana/web3.js';

export async function setupCreateGame(
  conn: web3.Connection,
  programId: web3.PublicKey,
  owner: web3.PublicKey,
  game_id: String,
) {
  // const contractAdmin = await findContractAdmin(w)
}

export async function findStartLocationAccount(gameId: String) {
  return await web3.PublicKey.findProgramAddress(
    [
      Buffer.from(gameId),
      new BN(0).toArrayLike(Buffer, 'be', 1),
      new BN(0).toArrayLike(Buffer, 'be', 1),
    ],
    LEGACY_PROGRAM_ID,
  );
}

export async function findSpawnLocationAccount(gameId: String) {
  return await web3.PublicKey.findProgramAddress(
    [
      Buffer.from(gameId),
      new BN(0).toArrayLike(Buffer, 'be', 1),
      new BN(0).toArrayLike(Buffer, 'be', 1),
    ],
    LEGACY_PROGRAM_ID,
  );
}

export async function createInitializeInstruction(
  adminAccount: web3.PublicKey,
  owner: web3.PublicKey,
): Promise<web3.TransactionInstruction[]> {
  return;
}

async function getFeatures() {
  let raw = JSON.parse(features.toString());
  let features: Feature[] = [];
  for (let f of raw) {
    features.push({
      weight: new BN(f.weight),
      name: f.name,
      nextScan: new BN(f.next_scan),
    });
  }
  return features;
}

export async function createGameInstruction(
  gameId: String,
  gameAccountBump: String,
  owner: web3.PublicKey,
  startLocBump: String,
  intialCard: UnitMod,
  accounts: web3.Keypair[],
) {
  // gameAccount.bum
  return;
}

export async function addFeaturesInstruction(
  features: Feature[],
  accounts: web3.Keypair[],
) {
  // instruction
  return;
}

function bnToU64Buffer(bn: BN) {
  const b = Buffer.from(bn.toArray().reverse());
  if (b.length === 8) {
    return b;
  }
  assert(b.length < 8, 'u64 too large');

  const zeroPad = Buffer.alloc(8);
  b.copy(zeroPad);
  return zeroPad;
}
