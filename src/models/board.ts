import { generateId, shuffle, Pojo } from "../utils";
import { getOppositeSide } from "../utils/get-opposite-side";
import canCardsConnect from "../utils/can-cards-connect";
import Position from "./position";
import { getPlacedCards } from "./cards";
import {
  PassageCard,
  DeadendCard,
  PathCard,
  FinishPathCard,
  GoldFinishPathCard,
} from "./cards/path-cards";
import { Status, Sides } from "./cards/card";

interface IGrid {
  [key: string]: PathCard;
}

export const startPosition = new Position(0, 0);
export const topFinishPosition = new Position(8, 2);
export const middleFinishPosition = new Position(8, 0);
export const bottomFinishPosition = new Position(8, -2);

class Board {
  id: string;
  isComplete: boolean;
  private grid: IGrid;

  constructor() {
    this.id = generateId();
    this.isComplete = false;
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

  visualize(): string {
    const availablePositions = this.getAvailablePositions();
    const availablePositionKeys = availablePositions.map((availablePosition) =>
      availablePosition.toString()
    );
    const markedPositions = Object.keys(this.grid).concat(
      availablePositionKeys
    );
    const dimensions = markedPositions.reduce(
      ({ top, right, bottom, left }, positionKey) => {
        const [x, y] = positionKey
          .split(",")
          .map((value) => parseInt(value, 10));
        return {
          top: y > 0 ? Math.max(top, y) : top,
          right: x > 0 ? Math.max(right, x) : right,
          bottom: y < 0 ? Math.max(Math.abs(bottom), Math.abs(y)) * -1 : bottom,
          left: x < 0 ? Math.max(Math.abs(left), Math.abs(x)) * -1 : left,
        };
      },
      { top: 0, right: 0, bottom: 0, left: 0 }
    );

    const BLANK_SPACE = "      \n      \n      \n";
    const AVAILABLE_SPACE = "╭┄┄┄┄╮\n│    │\n╰┄┄┄┄╯";
    const rowGrid = [];
    for (let y = dimensions.top; y >= dimensions.bottom; y--) {
      rowGrid.push([] as string[]);
      for (let x = dimensions.left; x <= dimensions.right; x++) {
        const card = this.getCardAt(new Position(x, y));
        if (card) {
          rowGrid[dimensions.top - y].push(card.visualize());
          continue;
        }

        const isAvailablePosition = availablePositions.some(
          (availablePosition) =>
            availablePosition.x === x && availablePosition.y === y
        );
        rowGrid[dimensions.top - y].push(
          isAvailablePosition ? AVAILABLE_SPACE : BLANK_SPACE
        );
      }
    }

    const lineGrid = rowGrid.reduce(
      (flattenedGrid, row) =>
        flattenedGrid.concat(
          [0, 1, 2].map((index) =>
            row.map((item: string) => item.split("\n")[index])
          )
        ),
      [] as string[][]
    );

    return lineGrid.map((row) => row.join("")).join("\n");
  }

  addCard(card: PassageCard | DeadendCard, position: Position): void {
    if (!(card instanceof PassageCard) && !(card instanceof DeadendCard)) {
      throw new Error(`Invalid type of card provided`);
    }

    if (card.status !== Status.unused) {
      throw new Error(`This card has already been played or discarded`);
    }

    if (this.grid[position.toString()]) {
      throw new Error(`Position ${position} is already occupied`);
    }

    const availablePositions = this.getAvailablePositions();
    const matchingPosition = availablePositions.find(
      ({ x, y }) => position.x === x && position.y === y
    );
    if (!matchingPosition) {
      throw new Error(`Position ${position} is not available`);
    }

    const adjacentCards = this.getAdjacentCards(position);
    const cardFits = adjacentCards.every((adjacentCard, index) =>
      canCardsConnect(index + 1, adjacentCard, card)
    );
    if (!cardFits) {
      throw new Error(
        `Selected card cannot cannot fit in position ${position}`
      );
    }

    card.setPlayed();
    this.grid[position.toString()] = card;

    const adjacentFinishPathCards = adjacentCards.filter(
      (adjacentCard) => adjacentCard instanceof FinishPathCard
    );
    (adjacentFinishPathCards as FinishPathCard[]).forEach(
      (adjacentFinishPathCard) => {
        const side = adjacentCards.indexOf(adjacentFinishPathCard) + 1;

        // Check we are actually trying to connect to the finish path card
        // and not just placing a card beside it
        if (
          (!card.isUpsideDown && !card.connectors.includes(side)) ||
          (card.isUpsideDown &&
            !card.connectors.includes(getOppositeSide(side)))
        ) {
          return;
        }

        adjacentFinishPathCard.turnOver(getOppositeSide(side));

        if (adjacentFinishPathCard instanceof GoldFinishPathCard) {
          this.isComplete = true;
          ([
            this.getCardAt(topFinishPosition),
            this.getCardAt(middleFinishPosition),
            this.getCardAt(bottomFinishPosition),
          ] as FinishPathCard[]).forEach((finishCard) => {
            if (finishCard === adjacentFinishPathCard) return;
            finishCard.turnOver(Sides.left);
          });
        }
      }
    );
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

  getAvailablePositions(): Position[] {
    const visitedPositions: { [key: string]: boolean } = {};
    const availablePositions: Position[] = [];

    const findAvailablePositionsFrom = (position: Position) => {
      if (visitedPositions[position.toString()]) return;
      visitedPositions[position.toString()] = true;

      const card = this.getCardAt(position);
      if (!card) return availablePositions.push(position);

      // There are no available positions around dead-end cards as they don't
      // continue the passage
      if (card instanceof DeadendCard) return;

      const cardConnectors = card.connectors.map((connector) =>
        card.isUpsideDown ? getOppositeSide(connector) : connector
      );
      const connectsToTop = cardConnectors.includes(Sides.top);
      const connectsToRight = cardConnectors.includes(Sides.right);
      const connectsToBottom = cardConnectors.includes(Sides.bottom);
      const connectsToLeft = cardConnectors.includes(Sides.left);

      if (connectsToTop) findAvailablePositionsFrom(position.above());
      if (connectsToRight) findAvailablePositionsFrom(position.right());
      if (connectsToBottom) findAvailablePositionsFrom(position.below());
      if (connectsToLeft) findAvailablePositionsFrom(position.left());
    };

    findAvailablePositionsFrom(startPosition);

    return availablePositions;
  }

  getAdjacentCards(position: Position): (PathCard | undefined)[] {
    const top = this.getCardAt(position.above());
    const right = this.getCardAt(position.right());
    const bottom = this.getCardAt(position.below());
    const left = this.getCardAt(position.left());

    return [top, right, bottom, left];
  }

  toJSON(): Pojo {
    return {
      id: this.id,
      grid: this.grid,
    };
  }
}

export default Board;
