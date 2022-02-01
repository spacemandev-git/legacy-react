import * as anchor from '@project-serum/anchor';

export type Feature = {
  name: string;
  weight: anchor.BN;
  nextScan: anchor.BN;
};

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
  modInf: anchor.BN; //8
  modArmor: anchor.BN; //8
  modAir: anchor.BN; //8,
};

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
