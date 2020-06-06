import Card, { Sides } from "../card";
import { Pojo } from "../../../utils";
import CardParameters from "../card-parameters";

class PathCard extends Card {
  connectors: Sides[];
  isUpsideDown: boolean;
  parameters: CardParameters | undefined;

  constructor(connectors: Sides[], isUpsideDown?: boolean) {
    super();
    this.connectors = connectors;
    this.isUpsideDown = isUpsideDown || false;
  }

  rotate(): boolean {
    this.isUpsideDown = !this.isUpsideDown;
    return this.isUpsideDown;
  }

  play(parameters: CardParameters): PathCard {
    super.play(parameters);
    this.parameters = parameters;
    return this;
  }

  visualize(): string {
    throw new Error("Not implemented");
  }

  toJS(): Pojo {
    return {
      ...super.toJS(),
      connectors: this.connectors,
      isUpsideDown: this.isUpsideDown,
      parameters: this.parameters,
    };
  }
}

export default PathCard;
