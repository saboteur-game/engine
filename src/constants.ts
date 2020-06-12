export const MAX_PLAYERS = 10;

export const MIN_PLAYERS = 3;

export const SPACE_SIDES = 4;

export const NUMBER_OF_ROUNDS = 3;

export const MAX_REWARD_CARDS = 9;

export enum Tools {
  pick = "pick",
  lamp = "lamp",
  wagon = "wagon",
}

interface IRoleRatio {
  [key: number]: {
    saboteurs: number;
    goldDiggers: number;
  };
}

export const roleRatio: IRoleRatio = {
  3: { saboteurs: 1, goldDiggers: 3 },
  4: { saboteurs: 1, goldDiggers: 4 },
  5: { saboteurs: 2, goldDiggers: 4 },
  6: { saboteurs: 2, goldDiggers: 5 },
  7: { saboteurs: 3, goldDiggers: 5 },
  8: { saboteurs: 3, goldDiggers: 6 },
  9: { saboteurs: 3, goldDiggers: 7 },
  10: { saboteurs: 4, goldDiggers: 7 },
};

interface IPlayerMapping {
  [key: number]: number;
}

export const saboteurGoldAllocation: IPlayerMapping = {
  0: 0,
  1: 4,
  2: 3,
  3: 3,
  4: 2,
};

export const initialHandSizes: IPlayerMapping = {
  3: 6,
  4: 6,
  5: 6,
  6: 5,
  7: 5,
  8: 4,
  9: 4,
  10: 4,
};
