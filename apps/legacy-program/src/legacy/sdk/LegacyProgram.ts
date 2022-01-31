import { BN, Provider, web3 } from '@project-serum/anchor';
import BigNumber from 'bignumber.js';
import { Program } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';

import {
  confirmTransaction,
  findAssociatedTokenAccount,
  getParsedMultipleAccountsInfo,
  PDA,
  sendTransaction,
  Setup,
} from '..';
// import { features, unit_mod, units } from '../configs';
import { Feature, UnitMod, LegacyConfig } from '../configs';
import { SystemProgram } from '@solana/web3.js';
import { getPDA } from '../utils/utils';
import { UnitActions } from './UnitActions';
import { PlayerMovement } from './Player';
import { CardActions } from './CardActions';
import * as anchor from '@project-serum/anchor';
import { LEGACY_PROGRAM_ID } from '.';

export class LegacyProgram {
  legacyGameConfig: LegacyConfig;
  unitActions: UnitActions;
  playerMovement: PlayerMovement;
  cardActions: CardActions;
  program: Program;

  constructor(private provider: Provider, overrideConfig: LegacyConfig) {
    this.legacyGameConfig = overrideConfig;
    this.connect().then((program) => {
      this.unitActions = new UnitActions(this.provider, program);
      this.playerMovement = new PlayerMovement(this.provider, program);
      this.cardActions = new CardActions(this.provider, program);
    });
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

  async connect() {
    const idl = await anchor.Program.fetchIdl(LEGACY_PROGRAM_ID, this.provider);
    if (!idl) throw 'IDL not found';
    this.program = new anchor.Program(idl, LEGACY_PROGRAM_ID, this.provider);
    return this.program;
  }

  

  async create_game(name: string) {
    const [game_acc, game_bmp] = findProgramAddressSync(
      [Buffer.from(name)],
      this.program.programId,
    );
    const [start_loc, start_loc_bmp] = findProgramAddressSync(
      [
        Buffer.from(name),
        new anchor.BN(0).toArrayLike(Buffer, 'be', 1),
        new anchor.BN(0).toArrayLike(Buffer, 'be', 1),
      ],
      this.program.programId,
    );
    const unit = this.legacyProgram.unitConfig.find((x) => x.name == 'Scout')!;
    const rust_starting_unit = {
      name: unit.name,
      link: unit.link,
      class: { infantry: {} },
      power: new anchor.BN(unit.power),
      range: new anchor.BN(unit.range),
      recovery: new anchor.BN(unit.recovery),
      modInf: new anchor.BN(unit.modInf),
      modArmor: new anchor.BN(unit.modArmor),
      modAir: new anchor.BN(unit.modAir),
    };
    const starting_card = {
      dropTable: { basic: {} },
      id: new anchor.BN(0),
      cardType: { unit: rust_starting_unit },
    };
    const create_game = this.program.rpc.createGame(
      name,
      new anchor.BN(game_bmp),
      new anchor.BN(start_loc_bmp),
      starting_card,
      {
        accounts: {
          authority: this.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          gameAccount: game_acc,
          startLocation: start_loc,
        },
      },
    );
    console.log('Initalized Game');

    return create_game;
  }

  async initCards(name: string, gameAccount: string, id: number) {
    let unit_promises: Promise<any>[] = [];
    //RPC Cards
    for (let unit of this.legacyProgram.unitConfig) {
      const rust_unit = {
        name: unit.name,
        link: unit.link,
        class: { [unit.class.toLowerCase()]: {} }, //{[unit.class]: {}}, //getClass(unit.class),
        power: new anchor.BN(unit.power),
        range: new anchor.BN(unit.range),
        recovery: new anchor.BN(unit.recovery),
        modInf: new anchor.BN(unit.modInf),
        modArmor: new anchor.BN(unit.modArmor),
        modAir: new anchor.BN(unit.modAir),
      };

      const card = {
        dropTable: { [unit.drop_table]: {} }, //{basic: {}},// //getDropTable(unit.drop_table),
        id: new anchor.BN(id),
        cardType: {
          unit: {
            unit: rust_unit,
          },
        },
      };

      const [card_acc, card_bmp] = findProgramAddressSync(
        [Buffer.from(name), new anchor.BN(id).toArrayLike(Buffer, 'be', 8)],
        this.program.programId,
      );

      //@ts-ignore
      unit_promises.push(
        this.program.rpc.initCard(card, card_bmp, {
          accounts: {
            game: gameAccount,
            cardAcc: card_acc,
            authority: this.provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          },
        }),
      );

      id++;
    }
    await Promise.all(unit_promises);
    console.log('Units Instantiated');
  }

  async initGameConfiguration(name: string, gameAccount: string) {
    let id = 1;
    const features = await this.initFeatures(gameAccount);
    const cards = await this.initCards(name, gameAccount, id);
    const mods = await this.initMods(name, gameAccount, id);
    
    //Print Game Acc and Total Cards Uploaded
    console.log(`Uploaded ${id} Cards`);

    const account = await this.program.account.game.fetch(gameAccount);
    console.log("Game Account: ");
    console.log(JSON.stringify(account));
    // await fs.writeFile('migrations/game_acc.json', JSON.stringify(account));
  }

  async initFeatures(gameAccount: string) {

    let features: Feature[] = [];

    for (let f of this.legacyProgram.featureConfig) {
      features.push({
        weight: new anchor.BN(f.weight),
        name: f.name,
        nextScan: new anchor.BN(f.next_scan),
      });
    }
      return features;
    }


    //Need to cast it to Rust Enum
    const rust_features = this.legacyProgram.featureConfig.map((f) => {
      const rust_f: any = {};
      if (f.drop_table == 'basic') {
        rust_f.dropTable = { basic: {} };
      } else if (f.drop_table == 'rare') {
        rust_f.dropTable = { rare: {} };
      } else if (f.drop_table == 'legendary') {
        rust_f.dropTable = { legendary: {} };
      } else if (f.drop_table == 'none') {
        rust_f.dropTable = { none: {} };
      }
      rust_f.name = f.name;
      rust_f.link = f.link;
      rust_f.scanRecovery = new anchor.BN(f.scan_recovery);
      rust_f.weight = new anchor.BN(f.weight);

      return rust_f;
    });

    await this.program.rpc.addFeatures(rust_features, {
      accounts: {
        game: gameAccount,
        authority: this.provider.wallet.publicKey,
      },
    });
    console.log('Added Features');
  }

  async initMods(name: string, gameAccount: string, id: number) {
    let mod_promises: Promise<any>[] = [];
    for (let mod of this.legacyGameConfig.modConfig) {
      const rust_mod = {
        name: mod.name,
        link: mod.link,
        class: { [mod.class.toLowerCase()]: {} },
        power: new anchor.BN(mod.power),
        range: new anchor.BN(mod.range),
        recovery: new anchor.BN(mod.recovery),
        modInf: new anchor.BN(mod.modInf),
        modArmor: new anchor.BN(mod.modArmor),
        modAir: new anchor.BN(mod.modAir),
      };
      const card = {
        dropTable: { [mod.drop_table]: {} },
        id: new anchor.BN(id),
        cardType: {
          unitMod: {
            umod: rust_mod,
          },
        },
      };
      const [card_acc, card_bmp] = findProgramAddressSync(
        [Buffer.from(name), new anchor.BN(id).toArrayLike(Buffer, 'be', 8)],
        this.program.programId,
      );
      //@ts-ignore
      mod_promises.push(
        this.program.rpc.initCard(card, card_bmp, {
          accounts: {
            game: gameAccount,
            cardAcc: card_acc,
            authority: this.provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          },
        }),
      );
      id++;
    }
    await Promise.all(mod_promises);
  }
}
