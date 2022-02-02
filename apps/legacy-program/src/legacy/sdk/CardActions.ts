import * as anchor from '@project-serum/anchor';
import { Program, Provider } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { Card, Coords } from '.';

export class CardActions {
  constructor(private provider: Provider, private program: Program) {}
  async scanForCards(loc: Coords) {
    const [playerAccount] = await findProgramAddressSync(
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

    const [locAccount] = await findProgramAddressSync(
      [
        Buffer.from(localStorage.getItem('gameName') || ''),
        Buffer.from(loc.x.toString()),
        Buffer.from(loc.y.toString()),
      ],
      this.program.programId,
    );

    const scannedLocation = this.program.rpc.scan({
      accounts: {
        game: gameAccount,
        location: locAccount,
        player: this.provider.wallet.publicKey,
        authority: playerAccount,
      },
    });

    console.log(scannedLocation);
  }
  async redeemCard(card: Card) {
    const [playerAccount] = await findProgramAddressSync(
      [
        Buffer.from(localStorage.getItem('gameName') || ''),
        this.provider.wallet.publicKey.toBuffer(),
      ],
      this.program.programId,
    );

    //Unsure about this one
    const [cardAccount] = await findProgramAddressSync(
      [
        Buffer.from(localStorage.getItem('gameName') || ''),
        Buffer.from(card.id.toString()),
      ],
      this.program.programId,
    );

    const redeemedCard = this.program.rpc.redeem({
      accounts: {
        player: this.provider.wallet.publicKey,
        authority: playerAccount,
        card: cardAccount,
      },
    });

    console.log(redeemedCard);
  }
}
