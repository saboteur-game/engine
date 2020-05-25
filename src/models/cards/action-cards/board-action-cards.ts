import { ActionCard } from ".";
import CardParameters from "../card-parameters";

export class BoardActionCard extends ActionCard {
  play(parameters: CardParameters): BoardActionCard {
    return super.play(parameters);
  }
}

export class MapActionCard extends BoardActionCard {}

export class RockfallActionCard extends BoardActionCard {}
