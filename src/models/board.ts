import { generateId, shuffle, Pojo } from "../utils";
import Position from "./position";
import Card from "./cards/card";
import { getPlacedCards } from "./cards";
import { PassageCard, DeadendCard } from "./cards/path-cards";

interface IGrid {
  [key: string]: Card;
}

export const startPosition = new Position(0, 0);
export const topFinishPosition = new Position(2, 7);
export const middleFinishPosition = new Position(0, 7);
export const bottomFinishPosition = new Position(-2, 7);

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
      [startPosition.toString()]: placedCards.start,
      [topFinishPosition.toString()]: top,
      [middleFinishPosition.toString()]: middle,
      [bottomFinishPosition.toString()]: bottom,
    };
  }

  addCard(card: PassageCard | DeadendCard, position: Position): void {
    if (!(card instanceof PassageCard) && !(card instanceof DeadendCard)) {
      throw new Error(`Invalid type of card provided`);
    }

    if (this.grid[position.toString()]) {
      throw new Error(`Position ${position} is already occupied`);
    }

    // TODO: Check card can be legally added here!!

    card.setPlayed();
    this.grid[position.toString()] = card;
  }

  removeCard(position: Position): PassageCard | DeadendCard {
    const card = this.grid[position.toString()];

    if (!card) throw new Error(`Position ${position} is already empty`);

    if (!(card instanceof PassageCard) && !(card instanceof DeadendCard)) {
      throw new Error(`Cannot remove card at ${position}`);
    }

    delete this.grid[position.toString()];
    return card;
  }

  getCardAt(position: Position): Card | undefined {
    return this.grid[position.toString()];
  }

  toJS(): Pojo {
    return {
      id: this.id,
      grid: this.grid,
    };
  }
}

export default Board;
