import { generateId, shuffle, Pojo } from "../utils";
import Position from "./position";
import { getPlacedCards } from "./cards";
import {
  PassageCard,
  DeadendCard,
  PathCard,
  FinishPathCard,
} from "./cards/path-cards";
// import canCardsConnect from "../utils/can-cards-connect";

interface IGrid {
  [key: string]: PathCard;
}

export const startPosition = new Position(0, 0);
export const topFinishPosition = new Position(7, 2);
export const middleFinishPosition = new Position(7, 0);
export const bottomFinishPosition = new Position(7, -2);

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

    // TODO: Should this check that the card being played is unused?

    if (this.grid[position.toString()]) {
      throw new Error(`Position ${position} is already occupied`);
    }

    // TODO: Uncomment when `getAvailablePositions` is available
    // const availablePositions = this.getAvailablePositions();
    // const matchingPosition = availablePositions.find(
    //   ({ x, y }) => position.x === x && position.y === y
    // );
    // if (!matchingPosition) {
    //   throw new Error(`Position ${position} is not available`);
    // }

    // const adjacentCards = this.getAdjacentCards(position);
    // const cardFits = adjacentCards.every((adjacentCard, index) =>
    //   canCardsConnect(index + 1, adjacentCard, card)
    // );
    // if (!cardFits) {
    //   throw new Error(`Selected cannot cannot fit in ${position}`);
    // }

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

  getCardAt(position: Position): PathCard | undefined {
    return this.grid[position.toString()];
  }

  // getAvailablePositions(): Position[] {
  //   // TODO: Implement
  //   // We need a function which can provide all legal spaces that a card can be placed on
  //   //   - and then we need to check that this position is one of those
  //   //   - Start at the starting square and follow the paths outwards?
  //   return [];
  // }

  getAdjacentCards(position: Position): (PathCard | undefined)[] {
    const top = this.getCardAt(new Position(position.x, position.y + 1));
    const right = this.getCardAt(new Position(position.x + 1, position.y));
    const bottom = this.getCardAt(new Position(position.x, position.y - 1));
    const left = this.getCardAt(new Position(position.x - 1, position.y));

    return [top, right, bottom, left].map((card) =>
      // Consider finish path cards as blank spaces for connection purposes
      // TODO: This is only the case when the finish card is face down - there's a ticket to cover this
      card instanceof FinishPathCard ? undefined : card
    );
  }

  toJS(): Pojo {
    return {
      id: this.id,
      grid: this.grid,
    };
  }
}

export default Board;
