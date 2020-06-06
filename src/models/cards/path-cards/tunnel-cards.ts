import { PathCard } from ".";
import getCardVisualization from "../../../utils/get-card-visualization";

export class TunnelCard extends PathCard {}

export class PassageCard extends TunnelCard {
  visualize(): string {
    return getCardVisualization(this);
  }
}

export class DeadendCard extends TunnelCard {
  visualize(): string {
    return getCardVisualization(this, "██");
  }
}
