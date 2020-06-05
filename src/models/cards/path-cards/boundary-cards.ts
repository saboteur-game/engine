import { PathCard } from ".";
import { Sides } from "../card";

export class StartPathCard extends PathCard {
  constructor(isUpsideDown?: boolean) {
    super([Sides.top, Sides.right, Sides.bottom, Sides.left], isUpsideDown);
  }
}

export class FinishPathCard extends PathCard {}

export class GoldFinishPathCard extends FinishPathCard {
  constructor(isUpsideDown?: boolean) {
    super([Sides.top, Sides.right, Sides.bottom, Sides.left], isUpsideDown);
  }
}

export class RockFinishPathCard extends FinishPathCard {}
