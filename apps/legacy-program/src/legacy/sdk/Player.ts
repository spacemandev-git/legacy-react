import * as anchor from '@project-serum/anchor';
import { Program, Provider } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
const { SystemProgram } = anchor.web3;

//Tests that players can be created
//Players can generate a start location (the map grows clockwise from max x,y)

import { Setup, PDA } from './type';

export class Player {
  constructor(
    private provider: Provider,
    private program: Program,
    gameAccount?: string,
  ) {}

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

  async createPlayer() {}

  async getPlayers() {
    // get all players in the game
    // DF object info
    // address: "0x788031553c923a5cd029a9ca707e1a8661cca1a5"
    // homePlanetId: "00004a7cad8e984bfbb64b33cb123048097e485ba3c5ff50831057e2b1c1ceda"
    // initTimestamp: 1633080975
    // lastClaimTimestamp: 0
    // lastRevealTimestamp: 0
    // score: 10001
    // twitter: "chubivan"
    // getPlayers subscription to look for new players
  }
}
