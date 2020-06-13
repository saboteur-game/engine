import Card from "../card";
import CardParameters from "../card-parameters";
import { Pojo } from "../../../utils";

class ActionCard extends Card {
  parameters: CardParameters | undefined;

  play(parameters: CardParameters): ActionCard {
    super.play(parameters);
    this.parameters = parameters;
    return this;
  }

  toJSON(): Pojo {
    return {
      ...super.toJSON(),
      parameters: this.parameters,
    };
  }
}

export default ActionCard;
