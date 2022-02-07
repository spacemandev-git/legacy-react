import { TokenInstructions } from "@project-serum/serum";
import { StakeProgram, SystemProgram } from "@solana/web3.js";

import { LEGACY_PROGRAM_ID } from "../sdk";

export const PROGRAMS_NAMES = {
  [TokenInstructions.TOKEN_PROGRAM_ID.toString()]: "Token program",
  [SystemProgram.programId.toString()]: "System program",
  [LEGACY_PROGRAM_ID.toString()]: "Legacy program",
};

export const PROGRAMS_ERRORS = {
  [LEGACY_PROGRAM_ID.toString()]: [
    {
      code: 0,
      msg: "You are not authorized to perform this action.",
      name: "Unauthorized",
    },
{
      code: 1,
      msg: "Game is not enabled.",
      name: "GameNotEnabled",
    },
{
      code: 2,
      msg: "Invalid Location",
      name: "InvalidLocation",
    },
{
      code: 3,
      msg: "Player doesn't own the tile",
      name: "PlayerLacksOwnership",
    },
{
      code: 4,
      msg: "No troops on selected tile",
      name: "NoTroopsOnSelectedTile",
    },
{
      code: 5,
      msg: "Destination tile is occupied",
      name: "DestinationOccupied",
    },
{
      code: 6,
      msg: "Locations from wrong game.",
      name: "WrongGameLocations",
    },
{
      code: 7,
      msg: "No troops on target tile.",
      name: "NoTroopsOnTarget",
    },
{
      code: 8,
      msg: "Distance exceeds Troop Range",
      name: "DistanceExceedsTroopRange",
    },
{
      code: 9,
      msg: "No friendly fire allowed",
      name: "NoFriendlyFire",
    },
{
      code: 10,
      msg: "Scan waiting to be redeemed!",
      name: "RedemptionAvailable",
    },
{
      code: 11,
      msg: "Location is still in cooldown from last scan",
      name: "LocationOnCooldown",
    },
{
      code: 12,
      msg: "Invalid Card Passed In",
      name: "InvalidCard",
    },
{
      code: 13,
      msg: "Mod cannot be applied to Unit.",
      name: "InvalidMod",
    },
{
      code: 14,
      msg: "Feature can't be scanned",
      name: "FeatureNotScannable",
    },
{
      code: 15,
      msg: "Unit Mod doesn't match the Unit's class",
      name: "InvalidUnitMod",
    },
{
      code: 16,
      msg: "Unit is still recovering",
      name: "UnitRecovering",
    },
  ]
};

export const KNOWN_GENERIC_ERRORS = [
  {
    msg: "Insufficient balance or debt celling reach. Check your SOL and collateral token balance and try again",
    name: "InsufficientBalance",
    code: 0
  },
];
