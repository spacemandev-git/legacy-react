import * as anchor from '@project-serum/anchor';
import { Program, Provider } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { PublicKey } from '@solana/web3.js';
import { Card, Coords } from '.';
import { LegacyClient } from './client';

export class CardActions {
  constructor(private client: LegacyClient, private playerPubkey: PublicKey) {}

  static async load(
    client: LegacyClient,
    address: PublicKey,
  ): Promise<CardActions> {
    const cardActions = new CardActions(client, address);

    return cardActions;
  }

  async scanForCards(gameName: string, loc: Coords) {
    const [playerAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || ''), this.playerPubkey.toBuffer()],
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

    const scannedLocation = await this.client.program.rpc.scan({
      accounts: {
        game: gameAccount,
        location: locAccount,
        player: playerAccount,
        authority: this.playerPubkey,
      },
    });

    console.log(scannedLocation);
    return scannedLocation;
  }
  async redeemCard(gameName: string, card: Card) {
    const [playerAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || ''), this.playerPubkey.toBuffer()],
      this.client.program.programId,
    );

    //Unsure about this one
    const [cardAccount] = await findProgramAddressSync(
      [Buffer.from(gameName || ''), Buffer.from(card.id.toString())],
      this.client.program.programId,
    );

    const redeemedCard = await this.client.program.rpc.redeem({
      accounts: {
        player: playerAccount,
        authority: this.playerPubkey,
        card: cardAccount,
      },
    });

    console.log(redeemedCard);
    return redeemedCard;
  }
}
