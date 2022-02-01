import * as anchor from '@project-serum/anchor';
import { Program, Provider } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
const { SystemProgram } = anchor.web3;

//Tests that players can be created
//Players can generate a start location (the map grows clockwise from max x,y)

import { Setup, PDA } from './type';

export class PlayerMovement {
  constructor(private provider: Provider, private program: Program) {}

  async initializePlayer(playerName: string) {
    const [playerAccount, playerBump] = await findProgramAddressSync(
      [
        Buffer.from(localStorage.getItem('gameName') || ''),
        this.provider.wallet.publicKey.toBuffer(),
      ],
      this.program.programId,
    );

    const [gameAccount] = await findProgramAddressSync(
      [Buffer.from(localStorage.getItem('gameName') || '')],
      this.program.programId,
    );

    const initializePlayer = this.program.rpc.initPlayer(
      playerBump,
      playerName,
      {
        accounts: {
          game: gameAccount,
          playerAccount: playerAccount,
          player: this.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      },
    );
    return initializePlayer;
  }

  async createPlayers(setup: Setup, amtPlayers: number) {
    return;
  }

  async spawnPlayers(setup: Setup, players: PDA[]) {
    return;
  }
}
