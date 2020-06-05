import { generateId, shuffle, Pojo } from "../utils";
import Position from "./position";
import Card from "./cards/card";
import { getPlacedCards } from "./cards";
import { PassageCard, DeadendCard } from "./cards/path-cards";
// import canCardsConnect from "../utils/can-cards-connect";

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

  getCardAt(position: Position): Card | undefined {
    return this.grid[position.toString()];
  }

  // getAvailablePositions(): Position[] {
  //   // 1. We need a function which can provide all legal spaces that a card can be placed on
  //   //   - and then we need to check that this position is one of those
  //   //   - Start at the starting square and follow the paths outwards?
  //   return [];
  // }

  // getAdjacentCards(position: Position): TunnelCard[] {
  //   // 2. We need to check what adjacent cards there are and the connectors they have
  //   return [];
  // }

  toJS(): Pojo {
    return {
      id: this.id,
      grid: this.grid,
    };
  }
}

export default Board;
