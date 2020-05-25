import { generateId, Pojo } from "../utils";
import { getShuffledDeck } from "./cards";
import { ActionCard } from "./cards/action-cards";
import { PathCard } from "./cards/path-cards";

class Deck {
  id: string;
  private drawPile: Array<ActionCard | PathCard>;

  constructor() {
    this.id = generateId();
    this.drawPile = getShuffledDeck();
  }

  drawCard(): ActionCard | PathCard | undefined {
    if (this.drawPile.length === 0) return undefined;
    const drawnCard = this.drawPile[0];
    this.drawPile = this.drawPile.slice(1);
    return drawnCard;
  }

  getCardCount(): number {
    return this.drawPile.length;
  }

  toJS(): Pojo {
    return {
      id: this.id,
      drawPile: this.drawPile,
    };
  }
}

export default Deck;
