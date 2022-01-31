import * as anchor from '@project-serum/anchor';
import { Program, Provider } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
const { SystemProgram } = anchor.web3;

//Tests that players can be created
//Players can generate a start location (the map grows clockwise from max x,y)

import { Setup, PDA } from './type';

export class PlayerMovement {
  constructor(private provider: Provider, private program: Program) {}

  async initializePlayer() {
    const [contractAdmin, contractAdminBump] = await findProgramAddressSync(
      [this.provider.wallet.publicKey.toBuffer()],
      this.program.programId,
    );

    const initializePlayer = this.program.rpc.initialize(contractAdminBump, {
      accounts: {
        adminAccount: contractAdmin,
        admin: this.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    });
    return initializePlayer;
  }

  async createPlayers(setup: Setup, amtPlayers: number) {
    return;
  }

  async spawnPlayers(setup: Setup, players: PDA[]) {
    return;
  }
}
