import { generateId, shuffle, Pojo } from "../utils";
import Card from "./cards/card";
import { getPlacedCards } from "./cards";
import { PassageCard, DeadendCard } from "./cards/path-cards";

interface IGrid {
  [key: string]: Card;
}

class Board {
  id: string;
  private grid: IGrid;

  constructor() {
    this.id = generateId();
    const placedCards = getPlacedCards();
    const [top, middle, bottom] = shuffle([
      placedCards.gold,
      placedCards.rock1,
      placedCards.rock2,
    ]);
    this.grid = {
      "0,0": placedCards.start,
      "2,7": top,
      "0,7": middle,
      "-2,7": bottom,
    };
  }

  addCard(card: PassageCard | DeadendCard, position: string): void {
    if (!(card instanceof PassageCard) && !(card instanceof DeadendCard)) {
      throw new Error(`Invalid type of card provided`);
    }

    if (this.grid[position]) {
      throw new Error(`Position ${position} is already occupied`);
    }

    // TODO: Check card can be legally added here!!

    card.setPlayed();
    this.grid[position] = card;
  }

  removeCard(position: string): PassageCard | DeadendCard {
    const card = this.grid[position];

    if (!card) throw new Error(`Position ${position} is already empty`);

    if (!(card instanceof PassageCard) && !(card instanceof DeadendCard)) {
      throw new Error(`Cannot remove card at ${position}`);
    }

    delete this.grid[position];
    return card;
  }

  getCardAt(position: string): Card | undefined {
    return this.grid[position];
  }

  toJS(): Pojo {
    return {
      id: this.id,
      grid: this.grid,
    };
  }
}

export default Board;
