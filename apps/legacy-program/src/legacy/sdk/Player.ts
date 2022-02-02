import * as anchor from '@project-serum/anchor';
import { Program, Provider } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { Setup, PDA, Coords, Card } from './type';
const { SystemProgram } = anchor.web3;

//Tests that players can be created
//Players can generate a start location (the map grows clockwise from max x,y)

export class Player {
  constructor(private provider: Provider, private program: Program) {}

  async initializePlayer(gameName: string, playerName: string) {
    const [playerAccount, playerBump] = await findProgramAddressSync(
      [Buffer.from(gameName || ''), this.provider.wallet.publicKey.toBuffer()],
      this.program.programId,
    );

    const [gameAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || '')],
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

  async initLocBySpawn(gameName: string, loc: Coords) {
    const [playerAccount, playerBump] = await findProgramAddressSync(
      [Buffer.from(gameName || ''), this.provider.wallet.publicKey.toBuffer()],
      this.program.programId,
    );

    const [gameAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || '')],
      this.program.programId,
    );

    const [locAccount] = await findProgramAddressSync(
      [
        Buffer.from(gameName || ''),
        Buffer.from(loc.x.toString()),
        Buffer.from(loc.y.toString()),
      ],
      this.program.programId,
    );

    const initializedLocation = this.program.rpc.initLocation(
      loc.x,
      loc.y,
      playerBump,
      {
        accounts: {
          game: gameAccount,
          location: locAccount,
          //TODO: Figure out a way to get this
          connectingLoc: locAccount,
          authority: playerAccount,
          systemProgram: SystemProgram.programId,
        },
      },
    );

    console.log(initializedLocation);
  }

  //place card if location is init already
  async playCard(gameName: string, loc: Coords, card: Card) {
    const [playerAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || ''), this.provider.wallet.publicKey.toBuffer()],
      this.program.programId,
    );

    const [gameAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || '')],
      this.program.programId,
    );

    const [locAccount] = await findProgramAddressSync(
      [
        Buffer.from(gameName || ''),
        Buffer.from(loc.x.toString()),
        Buffer.from(loc.y.toString()),
      ],
      this.program.programId,
    );
    const playedCard = this.program.rpc.playCard(card.id, card.cardType, {
      accounts: {
        game: gameAccount,
        location: locAccount,
        player: this.provider.wallet.publicKey,
        authority: playerAccount,
      },
    });

    console.log(playedCard);
  }

  private async prepTroopAccounts(
    gameName: string,
    originLoc: Coords,
    destinationLoc: Coords,
  ) {
    const [playerAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || ''), this.provider.wallet.publicKey.toBuffer()],
      this.program.programId,
    );

    const [gameAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || '')],
      this.program.programId,
    );

    const [originLocAccount] = await findProgramAddressSync(
      [
        Buffer.from(gameName || ''),
        Buffer.from(originLoc.x.toString()),
        Buffer.from(originLoc.y.toString()),
      ],
      this.program.programId,
    );

    const [destinationLocAccount] = await findProgramAddressSync(
      [
        Buffer.from(gameName || ''),
        Buffer.from(destinationLoc.x.toString()),
        Buffer.from(destinationLoc.y.toString()),
      ],
      this.program.programId,
    );

    return [
      playerAccount,
      gameAccount,
      originLocAccount,
      destinationLocAccount,
    ];
  }

  async moveTroops(
    gameName: string,
    originLoc: Coords,
    destinationLoc: Coords,
  ) {
    const [
      playerAccount,
      gameAccount,
      originLocAccount,
      destinationLocAccount,
    ] = await this.prepTroopAccounts(gameName, originLoc, destinationLoc);

    const movedTroops = this.program.rpc.moveTroops({
      accounts: {
        game: gameAccount,
        from: originLocAccount,
        destination: destinationLocAccount,
        player: this.provider.wallet.publicKey,
        authority: playerAccount,
      },
    });

    console.log(movedTroops);
  }

  async attack(gameName: string, originLoc: Coords, destinationLoc: Coords) {
    const [
      playerAccount,
      gameAccount,
      originLocAccount,
      destinationLocAccount,
    ] = await this.prepTroopAccounts(gameName, originLoc, destinationLoc);

    const movedTroops = this.program.rpc.attack({
      accounts: {
        game: gameAccount,
        from: originLocAccount,
        destination: destinationLocAccount,
        player: this.provider.wallet.publicKey,
        authority: playerAccount,
      },
    });

    console.log(movedTroops);
  }
}
