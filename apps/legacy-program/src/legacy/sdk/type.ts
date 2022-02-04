import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export interface TroopAndMod {
  drop_table: 'none' | 'basic' | 'rare' | 'legendary';
  name: string;
  link: string;
  class: 'Infantry' | 'Armor' | 'Aircraft';
  power: number;
  range: number;
  recovery: number;
  mod_inf: number;
  mod_armor: number;
  mod_air: number;
}

export type Troop = {
  name: string;
  link: string; //64  example is 63: //https://arweave.net/zt3-t8SHDSck0TLcSuC-hdQb2E0civ0DVMRgwf6sCz0
  class: any; //4
  range: anchor.BN;
  power: anchor.BN; //8
  mod_inf: anchor.BN; //8
  mod_armor: anchor.BN; //8
  mod_air: anchor.BN; //8,
};

export interface Feature {
  name: string;
  scan_recovery: number;
  weight: number;
  link: string;
  drop_table: 'basic' | 'rare' | 'legendary';
}

export interface TroopAndMod {
  drop_table: 'none' | 'basic' | 'rare' | 'legendary';
  name: string;
  link: string;
  class: 'Infantry' | 'Armor' | 'Aircraft';
  power: number;
  range: number;
  mod_inf: number;
  mod_armor: number;
  mod_air: number;
  recovery: number;
}

export interface LegacyConfig {
  programID: string;
  unitConfig: TroopAndMod[];
  modConfig: TroopAndMod[];
  featureConfig: Feature[];
}

export interface Setup {
  contractAdmin: PDA;
  gameacc: PDA;
  startLoc: PDA;
  gameId: String;
  program: anchor.Program;
}

export interface PDA {
  account: anchor.web3.PublicKey;
  bump: number;
}

export interface SpawnedPlayers {
  [player: string]: {
    x: number;
    y: number;
    acc: string;
  };
}

export interface Locs {
  [player: string]: {
    spawn: {
      x: number;
      y: number;
      acc: string;
    };
    adjacent: {
      x: number;
      y: number;
      acc: string;
    };
  };
}

export interface LocationPlayers {
  [player: string]: {
    x: number;
    y: number;
    acc: string;
  };
}

export interface Player {
  name: string;
  authority: PublicKey;
  cards: Card[];
  redeemableCards: RedeemableCard[];
}

export interface Card {
  dropTable: DropTable;
  id: number;
  cardType: CardType;
}

export interface CardType {
  none?: {};
  unitMod?: {
    umod: {
      name: string;
      link: string;
      class?: { infantry?: {}; aircraft?: {}; armor?: {} };
      range: number;
      power: number;
      mod_inf: number;
      mod_armor: number;
      mod_air: number;
      recovery: number;
    };
  };
  unit?: {
    unit: {
      class?: { infantry?: {}; aircraft?: {}; armor?: {} };
      lastMoved: anchor.BN;
      link: string;
      modAir: number;
      modArmor: number;
      modInf: number;
      name: string;
      power: number;
      range: number;
      recovery: number;
    };
  };
}

export interface RedeemableCard {
  dropTable: DropTable;
  id: number;
}

export interface DropTable {
  none?: {};
  basic?: {};
  rare?: {};
  legendary?: {};
}

export interface Game {
  id: String;
  authority: PublicKey;
  enabled: boolean;
  features: Feature[];
  locations: Coords[];
  starting_card: Card;
  //Not defining since its not used for FE
  // decks: DeckLen;
}

export interface Coords {
  x: number;
  y: number;
}

export interface Location {
  gameAcc: PublicKey;
  coords: Coords;
  feature?: Feature;
  troops?: Troop;
  tileOwner?: PublicKey;
}
