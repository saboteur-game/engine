import { generateId, Pojo } from "../utils";
import Card, { Status } from "./cards/card";

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

  getTopCard(): Card | null | undefined {
    const topCard = this.discardPile[0];
    if (!topCard) return undefined;

    // Return the played card. In the physical game, this would have been
    // discarded face-up after being played.
    if (topCard.status === Status.played) return topCard;

    // Return null. In the physical game, this would have been discarded
    // face-down. Null represents the presence of a card without any details
    // on what that card is.
    return null;
  }

  toJSON(): Pojo {
    return {
      id: this.id,
      discardPile: this.discardPile,
    };
  }
}

export default Discard;
