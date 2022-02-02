import { Provider, web3 } from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { LegacyConfig } from '../configs';
import { UnitActions } from './UnitActions';
import { PlayerMovement } from './Player';
import { CardActions } from './CardActions';

export class LegacyProgram {
  legacyGameConfig: LegacyConfig;
  unitActions: UnitActions;
  playerMovement: PlayerMovement;
  cardActions: CardActions;
  program: Program;

  constructor(
    private provider: Provider,
    program: Program,
    overrideConfig?: LegacyConfig,
  ) {
    this.legacyGameConfig = overrideConfig;
    this.program = program;
    this.unitActions = new UnitActions(this.provider, program);
    this.playerMovement = new PlayerMovement(this.provider, program);
    this.cardActions = new CardActions(this.provider, program);
  }

  /**
   * Legacy Program program ID
   *
   * @readonly
   * @memberof LegacyProgram
   */
  get programId() {
    return new web3.PublicKey(this.legacyGameConfig.programID);
  }

  /**
   * LegacyProgram config
   *
   * @readonly
   * @memberof LegacyProgram
   */
  get legacyProgram() {
    return {
      unitConfig: this.legacyGameConfig.unitConfig,
      modConfig: this.legacyGameConfig.modConfig,
      featureConfig: this.legacyGameConfig.featureConfig,
    };
  }

  async getGameAccount() {
    const [gameAccount] = await findProgramAddressSync(
      [Buffer.from(localStorage.getItem('gameName') || '')],
      this.program.programId,
    );
    const account = await this.program.account.game.fetch(gameAccount);
    console.log(account);

    return account;
  }
}
