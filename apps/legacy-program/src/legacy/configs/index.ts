import * as anchor from '@project-serum/anchor';
import { BN } from '@project-serum/anchor';
import featuresConfig from './features.json';

export interface Feature {
  name: string;
  scan_recovery: BN;
  weight: BN;
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
  recovery: number;
  modInf: number;
  modArmor: number;
  modAir: number;
}

export interface LegacyConfig {
  programID: string;
  unitConfig: TroopAndMod[];
  modConfig: TroopAndMod[];
  featureConfig: Feature[];
}
