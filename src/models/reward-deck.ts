import { Pojo, generateId, shuffle, multiply } from "../utils";
import GoldRewardCard from "./cards/gold-reward-cards";

const getValue = (allocatedCards: GoldRewardCard[]) =>
  allocatedCards.reduce(
    (total, allocatedCard) => total + allocatedCard.value,
    0
  );

class RewardDeck {
  id: string;
  private drawPile: GoldRewardCard[];

  constructor() {
    this.id = generateId();
    this.drawPile = shuffle([
      ...(multiply(4, () => new GoldRewardCard(3)) as GoldRewardCard[]),
      ...(multiply(8, () => new GoldRewardCard(2)) as GoldRewardCard[]),
      ...(multiply(16, () => new GoldRewardCard(1)) as GoldRewardCard[]),
    ]);
  }

  drawCard(): GoldRewardCard | undefined {
    if (this.drawPile.length === 0) return undefined;
    const drawnCard = this.drawPile[0];
    this.drawPile = this.drawPile.slice(1);
    return drawnCard;
  }

  getCardCount(): number {
    return this.drawPile.length;
  }

  private removeCardsFromPile(cards: GoldRewardCard[]) {
    cards.forEach((card) => {
      this.drawPile.splice(this.drawPile.indexOf(card), 1);
    });
  }

  extractCardsToValue(value: number): GoldRewardCard[] {
    let lastAllocation;
    // Iterate through the draw pile, using the next card as a starting point
    for (let i = 0; i <= this.drawPile.length - 1; i++) {
      const allocatedCards = this.drawPile
        .slice(i)
        .reduce((combination, card) => {
          const currentValue = getValue(combination);
          if (currentValue + card.value <= value) {
            return combination.concat(card);
          }
          // Check if replacing the last card gets us closer to the goal
          const withoutLastCard = getValue(combination.slice(0, -1));
          if (
            combination.length > 1 &&
            withoutLastCard + card.value <= value &&
            withoutLastCard + card.value > currentValue
          ) {
            return combination.slice(0, -1).concat(card);
          }

          return combination;
        }, [] as GoldRewardCard[]);

      // Have we created a combination which matches what we're looking for
      if (getValue(allocatedCards) === value) {
        this.removeCardsFromPile(allocatedCards);
        return allocatedCards;
      }
      lastAllocation = allocatedCards;
    }

    // If all else fails, use the last allocation as a starting point and
    // generate some new cards to make up the difference  ¯\_(ツ)_/¯
    const currentlyAllocated = lastAllocation as GoldRewardCard[];
    const remaining = value - getValue(currentlyAllocated);
    this.removeCardsFromPile(currentlyAllocated);
    return currentlyAllocated.concat(
      multiply(remaining, () => new GoldRewardCard(1))
    );
  }

  toJSON(): Pojo {
    return {
      id: this.id,
      drawPile: this.drawPile,
    };
  }
}

export default RewardDeck;
