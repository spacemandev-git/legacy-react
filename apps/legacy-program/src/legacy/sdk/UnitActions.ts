//anyone can create a new map location as long as it's within max X,Y grid
//submitting a new location creates a new PDA account for the location which computes the features on it
//players start with troops on their start location
//players can move troops from one tile to another
//when moving troops into a tile with occupying troops combat occurs
//test melee & ranged combat
//test modifiers work against proper units

import * as anchor from '@project-serum/anchor';
import { Program, Provider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { LegacyClient } from './client';
const { SystemProgram } = anchor.web3;
import { Locs, Setup, SpawnedPlayers } from './type';

export class UnitActions {
  gameId: string;
  setup: Setup;
  constructor(private client: LegacyClient, private playerPubkey: PublicKey) {}

  static async load(
    client: LegacyClient,
    address: PublicKey,
  ): Promise<UnitActions> {
    const player = new UnitActions(client, address);

    return player;
  }

  async initLocBySpawn() {
    return;
  }

  async moveUnit(setup: Setup, locs: Locs) {}

  async attack() {}
}
