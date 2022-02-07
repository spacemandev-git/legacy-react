import * as anchor from '@project-serum/anchor';
import { Program, Provider } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { PublicKey } from '@solana/web3.js';
import { LegacyClient } from './client';
import { Setup, PDA, Coords, Card } from './type';
const { SystemProgram } = anchor.web3;

//Tests that players can be created
//Players can generate a start location (the map grows clockwise from max x,y)

export class PlayerActions {
  constructor(private client: LegacyClient, private playerPubKey: PublicKey) {}

  static async load(
    client: LegacyClient,
    address: PublicKey,
  ): Promise<PlayerActions> {
    const player = new PlayerActions(client, address);

    return player;
  }

  async initializePlayer(gameName: string, playerName: string) {
    const [playerAccount, playerBump] = await findProgramAddressSync(
      [Buffer.from(gameName || ''), this.playerPubKey.toBuffer()],
      this.client.program.programId,
    );

    const [gameAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || '')],
      this.client.program.programId,
    );

    const initializePlayer = this.client.program.rpc.initPlayer(
      playerBump,
      playerName,
      {
        accounts: {
          game: gameAccount,
          playerAccount: playerAccount,
          player: this.playerPubKey,
          systemProgram: SystemProgram.programId,
        },
      },
    );
    return initializePlayer;
  }

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

  async initLocBySpawn(gameName: string, loc: Coords, connectingLoc: Coords) {
    const [gameAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || '')],
      this.client.program.programId,
    );

    const [locAccount, bumpLoc] = await findProgramAddressSync(
      [
        Buffer.from(gameName || ''),
        new anchor.BN(loc.x).toArrayLike(Buffer, 'be', 1),
        new anchor.BN(loc.y).toArrayLike(Buffer, 'be', 1),
      ],
      this.client.program.programId,
    );

    const [connectingLocAccount] = await findProgramAddressSync(
      [
        Buffer.from(gameName || ''),
        new anchor.BN(connectingLoc.x).toArrayLike(Buffer, 'be', 1),
        new anchor.BN(connectingLoc.y).toArrayLike(Buffer, 'be', 1),
      ],
      this.client.program.programId,
    );

    const initializedLocation = await this.client.program.rpc.initLocation(
      loc.x,
      loc.y,
      bumpLoc,
      {
        accounts: {
          game: gameAccount,
          location: locAccount,
          connectingLoc: connectingLocAccount,
          authority: this.playerPubKey,
          systemProgram: SystemProgram.programId,
        },
      },
    );
    console.log(initializedLocation);
  }

  async getLocationAccounts(gameName: string, locations: Coords[]) {
    let locationAccounts: PublicKey[] = [];
    for (const loc of locations) {
      try {
        const [locPubKey] = await findProgramAddressSync(
          [
            Buffer.from(gameName || ''),
            new anchor.BN(loc.x).toArrayLike(Buffer, 'be', 1),
            new anchor.BN(loc.y).toArrayLike(Buffer, 'be', 1),
          ],
          this.client.program.programId,
        );
        locationAccounts.push(locPubKey);
      } catch (_e) {
        continue;
      }
    }

    return await this.client.program.account.location.fetchMultiple(
      locationAccounts,
    );
  }

  static getSurroundingTiles(locations: Coords[]) {
    let unitializedTiles: Coords[] = [];

    //Used to calc surrounding coords
    const neighbours = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    //TODO: need to be more efficient
    locations?.forEach((activeLoc) => {
      neighbours.forEach(([dx, dy]) => {
        if (activeLoc.x + dx < 0 || activeLoc.y + dy < 0) return;
        if (
          !locations.find(
            (loc) => loc.x === activeLoc.x + dx && loc.y === activeLoc.y + dy,
          ) &&
          !unitializedTiles.find(
            (loc) => loc.x === activeLoc.x + dx && loc.y === activeLoc.y + dy,
          )
        ) {
          unitializedTiles.push({
            x: activeLoc.x + dx,
            y: activeLoc.y + dy,
          } as Coords);
        }
      });
    });

    return unitializedTiles;
  }

  //place card if location is init already
  async playCard(gameName: string, loc: Coords, card: Card) {
    const [playerAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || ''), this.playerPubKey.toBuffer()],
      this.client.program.programId,
    );

    const [gameAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || '')],
      this.client.program.programId,
    );

    const [locAccount] = await findProgramAddressSync(
      [
        Buffer.from(gameName || ''),
        new anchor.BN(loc.x).toArrayLike(Buffer, 'be', 1),
        new anchor.BN(loc.y).toArrayLike(Buffer, 'be', 1),
      ],
      this.client.program.programId,
    );

    const playedCard = this.client.program.rpc.playCard(card.id, {
      accounts: {
        game: gameAccount,
        location: locAccount,
        player: playerAccount,
        authority: this.playerPubKey,
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
      [Buffer.from(gameName || ''), this.playerPubKey.toBuffer()],
      this.client.program.programId,
    );

    const [gameAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || '')],
      this.client.program.programId,
    );

    const [originLocAccount] = await findProgramAddressSync(
      [
        Buffer.from(gameName || ''),
        new anchor.BN(originLoc.x).toArrayLike(Buffer, 'be', 1),
        new anchor.BN(originLoc.y).toArrayLike(Buffer, 'be', 1),
      ],
      this.client.program.programId,
    );

    const [destinationLocAccount] = await findProgramAddressSync(
      [
        Buffer.from(gameName || ''),
        new anchor.BN(destinationLoc.x).toArrayLike(Buffer, 'be', 1),
        new anchor.BN(destinationLoc.y).toArrayLike(Buffer, 'be', 1),
      ],
      this.client.program.programId,
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
    console.log('orig', originLoc);
    console.log('dest', destinationLoc);

    const [
      playerAccount,
      gameAccount,
      originLocAccount,
      destinationLocAccount,
    ] = await this.prepTroopAccounts(gameName, originLoc, destinationLoc);

    const movedTroops = await this.client.program.rpc.moveTroops({
      accounts: {
        game: gameAccount,
        from: originLocAccount,
        destination: destinationLocAccount,
        player: playerAccount,
        authority: this.playerPubKey,
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

    const movedTroops = this.client.program.rpc.attack({
      accounts: {
        game: gameAccount,
        from: originLocAccount,
        destination: destinationLocAccount,
        player: this.playerPubKey,
        authority: playerAccount,
      },
    });

    console.log(movedTroops);
  }
}
