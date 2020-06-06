import { PathCard } from ".";
import { Sides } from "../card";
import getCardVisualization from "../../../utils/get-card-visualization";

export class StartPathCard extends PathCard {
  constructor(isUpsideDown?: boolean) {
    super([Sides.top, Sides.right, Sides.bottom, Sides.left], isUpsideDown);
  }

  visualize(): string {
    return getCardVisualization(this, "[]");
  }
}

export class FinishPathCard extends PathCard {}

export class GoldFinishPathCard extends FinishPathCard {
  constructor(isUpsideDown?: boolean) {
    super([Sides.top, Sides.right, Sides.bottom, Sides.left], isUpsideDown);
  }

  visualize(): string {
    return getCardVisualization(this, "!!");
  }
}

export class RockFinishPathCard extends FinishPathCard {
  visualize(): string {
    return getCardVisualization(this, "xx");
  }
}
