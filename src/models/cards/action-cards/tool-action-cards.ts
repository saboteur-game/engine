import { Tools } from "../../../constants";
import { ActionCard } from ".";
import { Pojo } from "../../../utils";
import { IToolActionCardParameters } from "../card-parameters";

export class ToolActionCard extends ActionCard {
  appliesTo: Tools[];

  constructor(appliesTo: Tools | Tools[]) {
    super();
    this.appliesTo = ([] as Tools[]).concat(appliesTo);
  }

  play(parameters: IToolActionCardParameters): ActionCard {
    if (!this.appliesTo.includes(parameters.appliedTo)) {
      throw new Error(
        `Invalid parameter provided. Cannot apply to ${parameters.appliedTo}`
      );
    }
    return super.play(parameters);
  }

  toJSON(): Pojo {
    return {
      ...super.toJSON(),
      appliesTo: this.appliesTo,
    };
  }
}

export class BreakActionCard extends ToolActionCard {}

export class RepairActionCard extends ToolActionCard {}
