import { Feature, LegacyConfig } from './type';
import unitConfig from '../configs/units.json';
import modConfig from '../configs/unit_mods.json';
import featureConfig from '../configs/features.json';
import { TroopAndMod } from '.';

export const LegacyConfigFile: LegacyConfig = {
  programID: 'Cz4TVYSDxwobuiKdtZY8ejp3hWL7WfCbPNYGUqnNBVSe',
  unitConfig: unitConfig as TroopAndMod[],
  modConfig: modConfig as TroopAndMod[],
  featureConfig: featureConfig as Feature[],
};
