import * as anchor from '@project-serum/anchor';
import { Program, Provider } from '@project-serum/anchor';

import { Setup, PDA } from './type';

export class CardActions {
  constructor(private provider: Provider, private program: Program) {}
  async scanForCards() {}
  async redeemCard() {}
  async playCard() {}
}
