import { PathCard } from ".";

export class StartPathCard extends PathCard {
  constructor(isUpsideDown?: boolean) {
    super([1, 2, 3, 4], isUpsideDown);
  }
}

export class FinishPathCard extends PathCard {}

export class GoldFinishPathCard extends FinishPathCard {
  constructor(isUpsideDown?: boolean) {
    super([1, 2, 3, 4], isUpsideDown);
  }
}

export class RockFinishPathCard extends FinishPathCard {}
