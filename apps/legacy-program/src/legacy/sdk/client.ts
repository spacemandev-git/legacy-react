import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { Feature, LegacyConfig } from './type';
import * as anchor from '@project-serum/anchor';
import { LegacyConfigFile, LEGACY_PROGRAM_ID } from '.';
import { PublicKey } from '@solana/web3.js';

export class LegacyClient {
  legacyGameConfig: LegacyConfig;

  constructor(public program: anchor.Program, public devnet?: boolean) {
    this.legacyGameConfig = LegacyConfigFile;
  }

  /**
   * Create a new client for interacting with the Jet lending program.
   * @param provider The provider with wallet/network access that can be used to send transactions.
   * @returns The client
   */
  static async connect(
    provider: anchor.Provider,
    devnet?: boolean,
  ): Promise<LegacyClient> {
    const idl = await anchor.Program.fetchIdl(LEGACY_PROGRAM_ID, provider);
    const program = new anchor.Program(idl!, LEGACY_PROGRAM_ID, provider);

    return new LegacyClient(program, devnet);
  }

  /**
   * LegacyProgram config
   *
   * @readonly
   * @memberof LegacyProgram
   */
  get legacyProgram() {
    console.log(this.legacyGameConfig);
    return {
      programID: this.program.programId.toBase58(),
      unitConfig: this.legacyGameConfig.unitConfig,
      modConfig: this.legacyGameConfig.modConfig,
      featureConfig: this.legacyGameConfig.featureConfig,
    };
  }

  async getGameAccount(gameId: string) {
    const [gameacc, gameAccountBump] = await findProgramAddressSync(
      [Buffer.from(gameId)],
      this.program.programId,
    );
    return await this.program.account.game.fetch(gameacc);
  }

  async createGame(name: string, authorityPubkey: PublicKey) {
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
      modInf: new anchor.BN(unit.mod_inf),
      modArmor: new anchor.BN(unit.mod_armor),
      modAir: new anchor.BN(unit.mod_air),
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
          authority: authorityPubkey,
          systemProgram: anchor.web3.SystemProgram.programId,
          gameAccount: game_acc,
          startLocation: start_loc,
        },
      },
    );
    console.log('Initalized Game');

    return create_game;
  }

  async initCards(
    name: string,
    authorityPubkey: PublicKey,
    gameAccount: string,
    id: number,
  ) {
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
        modInf: new anchor.BN(unit.mod_inf),
        modArmor: new anchor.BN(unit.mod_armor),
        modAir: new anchor.BN(unit.mod_air),
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
            authority: authorityPubkey,
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
    // const features = await this.initFeatures(gameAccount);
    // const cards = await this.initCards(name, gameAccount, id);
    // const mods = await this.initMods(name, gameAccount, id);

    //Print Game Acc and Total Cards Uploaded
    console.log(`Uploaded ${id} Cards`);

    const account = await this.program.account.game.fetch(gameAccount);
    console.log('Game Account: ');
    console.log(JSON.stringify(account));
    // await fs.writeFile('migrations/game_acc.json', JSON.stringify(account));
  }

  async initFeatures(gameAccount: string, authorityPubkey: PublicKey) {
    let features: Feature[] = [];

    for (let f of this.legacyProgram.featureConfig) {
      features.push({
        weight: f.weight,
        name: f.name,
        scan_recovery: f.weight,
        drop_table: 'legendary',
        link: '',
      });
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
        authority: authorityPubkey,
      },
    });
    return features;
  }

  async initMods(
    name: string,
    authorityPubkey: PublicKey,
    gameAccount: string,
    id: number,
  ) {
    let mod_promises: Promise<any>[] = [];
    for (let mod of this.legacyGameConfig.modConfig) {
      const rust_mod = {
        name: mod.name,
        link: mod.link,
        class: { [mod.class.toLowerCase()]: {} },
        power: new anchor.BN(mod.power),
        range: new anchor.BN(mod.range),
        recovery: new anchor.BN(mod.recovery),
        modInf: new anchor.BN(mod.mod_inf),
        modArmor: new anchor.BN(mod.mod_armor),
        modAir: new anchor.BN(mod.mod_air),
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
            authority: authorityPubkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          },
        }),
      );
      id++;
    }
    await Promise.all(mod_promises);
  }
}
