import Board, {
  startPosition,
  middleFinishPosition,
  topFinishPosition,
  bottomFinishPosition,
} from "../board";
import Position from "../position";
import {
  PathCard,
  FinishPathCard,
  StartPathCard,
  PassageCard,
  DeadendCard,
} from "../cards/path-cards";
import { Sides } from "../cards/card";

jest.spyOn(global.Math, "random").mockReturnValue(0.5);

const START_POSITION = startPosition;
const FINISH_POSITION = middleFinishPosition;
const PLAY_POSITION = new Position(0, 1);

const traverseBoard = (board: Board) => {
  board.addCard(new PassageCard([Sides.right, Sides.left]), new Position(1, 0));
  board.addCard(new PassageCard([Sides.right, Sides.left]), new Position(2, 0));
  board.addCard(new PassageCard([Sides.right, Sides.left]), new Position(3, 0));
  board.addCard(new PassageCard([Sides.right, Sides.left]), new Position(4, 0));
  board.addCard(new PassageCard([Sides.right, Sides.left]), new Position(5, 0));
  board.addCard(new PassageCard([Sides.right, Sides.left]), new Position(6, 0));
};

const isFaceDown = (board: Board, position: Position) =>
  (board.getCardAt(position) as FinishPathCard).isFaceDown;

const playPassage = (board: Board): void => {
  const passageCard = new PassageCard([
    Sides.top,
    Sides.right,
    Sides.bottom,
    Sides.left,
  ]);
  board.addCard(passageCard, PLAY_POSITION);
};

describe("Board", () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  it("can be serialized", () => {
    expect(board.toJSON()).toMatchSnapshot();
  });

  describe("visualize", () => {
    beforeEach(() => {
      // Passage up
      board.addCard(
        new PassageCard([Sides.top, Sides.bottom]),
        new Position(0, 1)
      );
      board.addCard(
        new PassageCard([Sides.top, Sides.bottom]),
        new Position(0, 2)
      );
      board.addCard(
        new PassageCard([Sides.top, Sides.bottom]),
        new Position(0, 3)
      );
      board.addCard(
        new PassageCard([Sides.top, Sides.bottom]),
        new Position(0, 4)
      );
      board.addCard(new DeadendCard([Sides.bottom]), new Position(0, 5));

      // Passage right
      board.addCard(
        new PassageCard([Sides.right, Sides.left]),
        new Position(1, 0)
      );
      board.addCard(
        new PassageCard([Sides.right, Sides.left]),
        new Position(2, 0)
      );
      board.addCard(
        new PassageCard([Sides.right, Sides.left]),
        new Position(3, 0)
      );
      board.addCard(
        new PassageCard([Sides.right, Sides.left]),
        new Position(4, 0)
      );
      board.addCard(
        new PassageCard([Sides.right, Sides.left]),
        new Position(5, 0)
      );
      board.addCard(
        new PassageCard([Sides.top, Sides.left]),
        new Position(6, 0)
      );
      board.addCard(
        new PassageCard([Sides.top, Sides.bottom]),
        new Position(6, 1)
      );
      board.addCard(
        new PassageCard([Sides.right, Sides.bottom]),
        new Position(6, 2)
      );
      board.addCard(
        new PassageCard([Sides.right, Sides.left]),
        new Position(7, 2)
      );

      // Passage down
      board.addCard(
        new PassageCard([Sides.top, Sides.bottom]),
        new Position(0, -1)
      );
      board.addCard(
        new PassageCard([Sides.top, Sides.bottom]),
        new Position(0, -2)
      );
      board.addCard(
        new PassageCard([Sides.top, Sides.bottom]),
        new Position(0, -3)
      );
      board.addCard(
        new PassageCard([Sides.top, Sides.bottom]),
        new Position(0, -4)
      );
      board.addCard(new DeadendCard([Sides.top]), new Position(0, -5));

      // Passage left
      board.addCard(
        new PassageCard([Sides.right, Sides.left]),
        new Position(-1, 0)
      );
      board.addCard(
        new PassageCard([Sides.right, Sides.left]),
        new Position(-2, 0)
      );
      board.addCard(
        new PassageCard([Sides.right, Sides.left]),
        new Position(-3, 0)
      );
      board.addCard(
        new PassageCard([Sides.right, Sides.left]),
        new Position(-4, 0)
      );
      board.addCard(new DeadendCard([Sides.right]), new Position(-5, 0));
    });

    it("returns displayable version of the board", () => {
      expect(board.visualize()).toMatchSnapshot();
    });
  });

  describe("get card from board", () => {
    describe("when start position provided", () => {
      it("returns start card", () => {
        expect(board.getCardAt(START_POSITION) instanceof StartPathCard).toBe(
          true
        );
      });
    });

    describe("when finish position provided", () => {
      it("returns finish card", () => {
        expect(board.getCardAt(FINISH_POSITION) instanceof FinishPathCard).toBe(
          true
        );
      });
    });

    describe("when empty position provided", () => {
      it("returns undefined", () => {
        expect(board.getCardAt(PLAY_POSITION)).toBe(undefined);
      });
    });
  });

  describe("add card to the board", () => {
    describe("when card cannot be added", () => {
      it("throws exception", () => {
        const pathCard = new PathCard([
          Sides.top,
          Sides.right,
          Sides.bottom,
          Sides.left,
        ]);
        expect(() => board.addCard(pathCard, PLAY_POSITION)).toThrow(
          "Invalid type of card provided"
        );
      });
    });

    describe("when card can be added", () => {
      let passageCard: PassageCard;

      beforeEach(() => {
        passageCard = new PassageCard([
          Sides.top,
          Sides.right,
          Sides.bottom,
          Sides.left,
        ]);
      });

      describe("and position is taken", () => {
        beforeEach(() => {
          playPassage(board);
        });

        it("throws exception", () => {
          expect(() => board.addCard(passageCard, PLAY_POSITION)).toThrow(
            "Position 0,1 is already occupied"
          );
        });
      });

      describe("and card is already discarded", () => {
        beforeEach(() => {
          passageCard.setDiscarded();
        });

        it("throws exception", () => {
          expect(() => board.addCard(passageCard, PLAY_POSITION)).toThrow(
            "This card has already been played or discarded"
          );
        });
      });

      describe("and card is already played", () => {
        beforeEach(() => {
          board.addCard(passageCard, new Position(-1, 0));
        });

        it("throws exception", () => {
          expect(() => board.addCard(passageCard, PLAY_POSITION)).toThrow(
            "This card has already been played or discarded"
          );
        });
      });

      describe("and the position is not available", () => {
        it("throws exception", () => {
          expect(() => board.addCard(passageCard, new Position(0, 2))).toThrow(
            "Position 0,2 is not available"
          );
        });
      });

      describe("and the position is not available", () => {
        it("throws exception", () => {
          expect(() =>
            board.addCard(
              new PassageCard([Sides.top, Sides.right, Sides.left]),
              PLAY_POSITION
            )
          ).toThrow("Selected card cannot cannot fit in position 0,1");
        });
      });

      describe("and position is empty", () => {
        it("adds card", () => {
          expect(() => board.addCard(passageCard, PLAY_POSITION)).not.toThrow();
          expect(board.getCardAt(PLAY_POSITION)).toBe(passageCard);
        });
      });

      describe("and card connects to finish card", () => {
        beforeEach(() => {
          traverseBoard(board);
        });

        it("turns over just that finish card", () => {
          expect(isFaceDown(board, topFinishPosition)).toBe(true);
          expect(isFaceDown(board, middleFinishPosition)).toBe(true);
          expect(isFaceDown(board, bottomFinishPosition)).toBe(true);
          board.addCard(
            new PassageCard([Sides.right, Sides.left]),
            new Position(7, 0)
          );
          expect(isFaceDown(board, topFinishPosition)).toBe(true);
          expect(isFaceDown(board, middleFinishPosition)).toBe(false);
          expect(isFaceDown(board, bottomFinishPosition)).toBe(true);
          expect(board.isComplete).toBe(false);
        });
      });

      describe("and card connects to two finish cards", () => {
        beforeEach(() => {
          traverseBoard(board);
          board.addCard(
            new PassageCard([Sides.bottom, Sides.left]),
            new Position(7, 0)
          );
          board.addCard(
            new PassageCard([Sides.top, Sides.right]),
            new Position(7, -1)
          );
        });

        it("turns over both connected finish card", () => {
          expect(isFaceDown(board, topFinishPosition)).toBe(true);
          expect(isFaceDown(board, middleFinishPosition)).toBe(true);
          expect(isFaceDown(board, bottomFinishPosition)).toBe(true);
          board.addCard(
            new PassageCard([Sides.top, Sides.bottom, Sides.left]),
            new Position(8, -1)
          );
          expect(isFaceDown(board, topFinishPosition)).toBe(true);
          expect(isFaceDown(board, middleFinishPosition)).toBe(false);
          expect(isFaceDown(board, bottomFinishPosition)).toBe(false);
          expect(board.isComplete).toBe(false);
        });
      });

      describe("and card connects to gold finish card", () => {
        beforeEach(() => {
          traverseBoard(board);
          board.addCard(
            new PassageCard([Sides.top, Sides.left]),
            new Position(7, 0)
          );
          board.addCard(
            new PassageCard([Sides.top, Sides.bottom]),
            new Position(7, 1)
          );
        });

        it("turns over all finish cards and completes the board", () => {
          expect(isFaceDown(board, topFinishPosition)).toBe(true);
          expect(isFaceDown(board, middleFinishPosition)).toBe(true);
          expect(isFaceDown(board, bottomFinishPosition)).toBe(true);
          board.addCard(
            new PassageCard([Sides.right, Sides.bottom]),
            new Position(7, 2)
          );
          expect(isFaceDown(board, topFinishPosition)).toBe(false);
          expect(isFaceDown(board, middleFinishPosition)).toBe(false);
          expect(isFaceDown(board, bottomFinishPosition)).toBe(false);
          expect(board.isComplete).toBe(true);
        });
      });
    });
  });

  describe("remove card from the board", () => {
    describe("when card cannot be removed from position", () => {
      it("throws exception", () => {
        expect(() => board.removeCard(START_POSITION)).toThrow(
          "Cannot remove card at 0,0"
        );
      });
    });

    describe("when card can be removed from position", () => {
      describe("and position is empty", () => {
        it("throws exception", () => {
          expect(() => board.removeCard(PLAY_POSITION)).toThrow(
            "Position 0,1 is already empty"
          );
        });
      });

      describe("and position is occupied", () => {
        beforeEach(() => {
          playPassage(board);
        });

        it("removes card", () => {
          expect(() => board.removeCard(PLAY_POSITION)).not.toThrow();
          expect(board.getCardAt(PLAY_POSITION)).toBe(undefined);
        });
      });
    });
  });

  describe("get adjacent cards from the board", () => {
    describe("when the position is beside the start card", () => {
      beforeEach(() => {
        board.addCard(
          new PassageCard([Sides.right, Sides.left]),
          new Position(1, 0)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.left]),
          new Position(2, 0)
        );
      });

      it("returns the start card and other surrounding cards", () => {
        expect(board.getAdjacentCards(new Position(1, 0))).toMatchSnapshot();
      });
    });

    describe("when the position is beside a finish card", () => {
      beforeEach(() => {
        board.addCard(
          new PassageCard([Sides.right, Sides.left]),
          new Position(1, 0)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.left]),
          new Position(2, 0)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.left]),
          new Position(3, 0)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.left]),
          new Position(4, 0)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.left]),
          new Position(5, 0)
        );
      });

      it("returns surrounding cards including finish card", () => {
        expect(board.getAdjacentCards(new Position(6, 0))).toMatchSnapshot();
      });
    });

    describe("when the position is beside nothing", () => {
      beforeEach(() => {
        board.addCard(
          new PassageCard([Sides.right, Sides.left]),
          new Position(1, 0)
        );
      });

      it("returns all empty spaces", () => {
        expect(board.getAdjacentCards(new Position(3, 0))).toMatchSnapshot();
      });
    });

    describe("when the position is surrounded", () => {
      const getDeadendCrossroads = () =>
        new DeadendCard([Sides.top, Sides.right, Sides.bottom, Sides.left]);

      const getPassageCrossroads = () =>
        new PassageCard([Sides.top, Sides.right, Sides.bottom, Sides.left]);

      beforeEach(() => {
        board.addCard(getDeadendCrossroads(), new Position(0, 1));
        board.addCard(getDeadendCrossroads(), new Position(0, -1));
        board.addCard(getPassageCrossroads(), new Position(1, 0));
        board.addCard(getPassageCrossroads(), new Position(1, 1));
        board.addCard(getPassageCrossroads(), new Position(1, -1));
        board.addCard(getPassageCrossroads(), new Position(2, 0));
        board.addCard(getDeadendCrossroads(), new Position(2, 1));
        board.addCard(getDeadendCrossroads(), new Position(2, -1));
      });

      it("returns surrounding cards", () => {
        expect(board.getAdjacentCards(new Position(1, 0))).toMatchSnapshot();
      });
    });
  });

  describe("get available positions from the board", () => {
    describe("initial board setup", () => {
      it("returns the four surrounding positions of the start position", () => {
        expect(board.getAvailablePositions()).toMatchSnapshot();
      });
    });

    describe("when there is a passage formed", () => {
      beforeEach(() => {
        board.addCard(
          new PassageCard([Sides.top, Sides.right, Sides.bottom]),
          new Position(0, -1)
        );
        board.addCard(
          new PassageCard([Sides.top, Sides.right, Sides.bottom, Sides.left]),
          new Position(1, 0)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.bottom]),
          new Position(1, 1)
        );
        board.addCard(
          new PassageCard([Sides.top, Sides.right, Sides.left]),
          new Position(2, 1)
        );
      });

      it("returns correct positions for continuing the passage ", () => {
        expect(board.getAvailablePositions()).toMatchSnapshot();
      });
    });

    describe("when there is a passage with dead-ends", () => {
      beforeEach(() => {
        board.addCard(
          new PassageCard([Sides.right, Sides.left]),
          new Position(-1, 0)
        );
        board.addCard(new DeadendCard([Sides.right]), new Position(-2, 0));
        board.addCard(
          new PassageCard([Sides.top, Sides.right, Sides.bottom]),
          new Position(0, -1)
        );
        board.addCard(
          new PassageCard([Sides.top, Sides.right, Sides.bottom, Sides.left]),
          new Position(1, 0)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.bottom]),
          new Position(1, 1)
        );
        board.addCard(
          new DeadendCard([Sides.top, Sides.bottom, Sides.left]),
          new Position(1, -1)
        );
        board.addCard(
          new DeadendCard([Sides.right, Sides.left]),
          new Position(2, 0)
        );
      });

      it("returns correct positions and does not put positions around dead ends", () => {
        expect(board.getAvailablePositions()).toMatchSnapshot();
      });
    });

    describe("when there is a circular passage", () => {
      beforeEach(() => {
        board.addCard(
          new PassageCard([Sides.right, Sides.left]),
          new Position(-1, 0)
        );
        board.addCard(
          new PassageCard([Sides.top, Sides.right, Sides.bottom]),
          new Position(0, -1)
        );
        board.addCard(
          new PassageCard([Sides.top, Sides.right, Sides.bottom, Sides.left]),
          new Position(1, 0)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.bottom]),
          new Position(1, 1)
        );
        board.addCard(
          new PassageCard([Sides.top, Sides.left]),
          new Position(1, -1)
        );
        board.addCard(
          new PassageCard([Sides.top, Sides.left]),
          new Position(2, 0)
        );
        board.addCard(
          new PassageCard([Sides.bottom, Sides.left]),
          new Position(2, 1)
        );
      });

      it("returns correct positions", () => {
        expect(board.getAvailablePositions()).toMatchSnapshot();
      });
    });

    describe("when there are no available positions", () => {
      beforeEach(() => {
        board.addCard(
          new PassageCard([Sides.top, Sides.left]),
          new Position(1, 0)
        );
        board.addCard(
          new PassageCard([Sides.bottom, Sides.left]),
          new Position(1, 1)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.bottom]),
          new Position(0, 1)
        );
        board.addCard(
          new PassageCard([Sides.top, Sides.left], true),
          new Position(-1, 0)
        );
        board.addCard(
          new PassageCard([Sides.bottom, Sides.left], true),
          new Position(-1, -1)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.bottom], true),
          new Position(0, -1)
        );
      });

      it("returns correct positions", () => {
        expect(board.getAvailablePositions()).toEqual([]);
      });
    });

    describe("when there is a passage formed with upside down cards", () => {
      beforeEach(() => {
        board.addCard(
          new PassageCard([Sides.top, Sides.right, Sides.bottom], true),
          new Position(0, -1)
        );
        board.addCard(
          new PassageCard(
            [Sides.top, Sides.right, Sides.bottom, Sides.left],
            true
          ),
          new Position(1, 0)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.bottom], true),
          new Position(2, 0)
        );
        board.addCard(
          new PassageCard([Sides.top, Sides.right, Sides.left], true),
          new Position(2, 1)
        );
      });

      it("returns correct positions for continuing the passage ", () => {
        expect(board.getAvailablePositions()).toMatchSnapshot();
      });
    });

    describe("when there is a passage formed to a finish path card", () => {
      beforeEach(() => {
        board.addCard(
          new PassageCard([Sides.top, Sides.right, Sides.bottom]),
          new Position(0, -1)
        );
        board.addCard(
          new PassageCard([Sides.top, Sides.right, Sides.bottom, Sides.left]),
          new Position(1, -1)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.left]),
          new Position(2, -1)
        );
        board.addCard(
          new PassageCard([Sides.bottom, Sides.left]),
          new Position(3, -1)
        );
        board.addCard(
          new PassageCard([Sides.top, Sides.right]),
          new Position(3, -2)
        );
        board.addCard(
          new PassageCard([Sides.top, Sides.right, Sides.bottom, Sides.left]),
          new Position(4, -2)
        );
        board.addCard(
          new PassageCard([Sides.top, Sides.right, Sides.left]),
          new Position(5, -2)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.left]),
          new Position(6, -2)
        );
        board.addCard(
          new PassageCard([Sides.right, Sides.left]),
          new Position(7, -2)
        );
      });

      it("returns correct positions for continuing the passage ", () => {
        expect(board.getAvailablePositions()).toMatchSnapshot();
      });
    });
  });
});
