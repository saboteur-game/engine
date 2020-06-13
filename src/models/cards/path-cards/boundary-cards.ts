import { Pojo } from "../../../utils";
import getCardVisualization from "../../../utils/get-card-visualization";
import { Sides } from "../card";
import { PathCard } from ".";

const UNKNOWN_CARD = "▕▔▔▔▔▏\n▕ ?? ▏\n▕▁▁▁▁▏";

export class StartPathCard extends PathCard {
  constructor(isUpsideDown?: boolean) {
    super([Sides.top, Sides.right, Sides.bottom, Sides.left], isUpsideDown);
  }

  visualize(): string {
    return getCardVisualization(this, "[]");
  }
}

export class FinishPathCard extends PathCard {
  isFaceDown: boolean;

  constructor(connectors: Sides[], isUpsideDown?: boolean) {
    super(connectors, isUpsideDown);
    this.isFaceDown = true;
  }

  turnOver(side: Sides): void {
    this.isFaceDown = false;
    if (!this.connectors.includes(side) && !this.isUpsideDown) {
      this.rotate();
    }
  }

  toJSON(): Pojo {
    return {
      ...super.toJSON(),
      isFaceDown: this.isFaceDown,
      ...(this.isFaceDown
        ? { connectors: [Sides.top, Sides.right, Sides.bottom, Sides.left] }
        : {}),
    };
  }
}

export class GoldFinishPathCard extends FinishPathCard {
  constructor(isUpsideDown?: boolean) {
    super([Sides.top, Sides.right, Sides.bottom, Sides.left], isUpsideDown);
  }

  visualize(): string {
    if (this.isFaceDown) return UNKNOWN_CARD;
    return getCardVisualization(this, "!!");
  }
}

export class RockFinishPathCard extends FinishPathCard {
  visualize(): string {
    if (this.isFaceDown) return UNKNOWN_CARD;
    return getCardVisualization(this, "xx");
  }
}
