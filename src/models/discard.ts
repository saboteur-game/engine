import { generateId, Pojo } from "../utils";
import Card from "./cards/card";

class Discard {
  id: string;
  private discardPile: Card[];

  constructor() {
    this.id = generateId();
    this.discardPile = [];
  }

  addPlayed(card: Card): void {
    card.setPlayed();
    this.discardPile = [card].concat(this.discardPile);
  }

  addDiscarded(card: Card): void {
    card.setDiscarded();
    this.discardPile = [card].concat(this.discardPile);
  }

  getCardCount(): number {
    return this.discardPile.length;
  }

  toJS(): Pojo {
    return {
      id: this.id,
      discardPile: this.discardPile,
    };
  }
}

export default Discard;
