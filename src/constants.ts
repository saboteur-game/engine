export const MAX_PLAYERS = 10;

export const MIN_PLAYERS = 3;

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

interface IInitialHandSizes {
  [key: number]: number;
}

export const initialHandSizes: IInitialHandSizes = {
  3: 6,
  4: 6,
  5: 6,
  6: 5,
  7: 5,
  8: 4,
  9: 4,
  10: 4,
};
