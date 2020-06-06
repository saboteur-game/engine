import Board, { startPosition, middleFinishPosition } from "../board";
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
    expect(board.toJS()).toMatchSnapshot();
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
        new PassageCard([Sides.top, Sides.left]),
        new Position(5, 0)
      );
      board.addCard(
        new PassageCard([Sides.top, Sides.bottom]),
        new Position(5, 1)
      );
      board.addCard(
        new PassageCard([Sides.right, Sides.bottom]),
        new Position(5, 2)
      );
      board.addCard(
        new PassageCard([Sides.right, Sides.left]),
        new Position(6, 2)
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

      describe("and position is empty", () => {
        it("adds card", () => {
          expect(() => board.addCard(passageCard, PLAY_POSITION)).not.toThrow();
          expect(board.getCardAt(PLAY_POSITION)).toBe(passageCard);
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
    let passageCard: PassageCard;

    describe("when the position is beside the start card", () => {
      beforeEach(() => {
        passageCard = new PassageCard([Sides.right, Sides.left]);
        board.addCard(passageCard, new Position(2, 0));
      });

      it("returns the start card and other surrounding cards", () => {
        expect(board.getAdjacentCards(new Position(1, 0))).toMatchSnapshot();
      });
    });

    describe("when the position is beside a finish card", () => {
      beforeEach(() => {
        passageCard = new PassageCard([Sides.right, Sides.left]);
        board.addCard(passageCard, new Position(5, 0));
      });

      it("returns surrounding cards but not the finish card", () => {
        expect(board.getAdjacentCards(new Position(6, 0))).toMatchSnapshot();
      });
    });

    describe("when the position is beside nothing", () => {
      beforeEach(() => {
        passageCard = new PassageCard([Sides.right, Sides.left]);
        board.addCard(passageCard, new Position(1, 0));
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
        board.addCard(getPassageCrossroads(), new Position(1, 1));
        board.addCard(getDeadendCrossroads(), new Position(2, 1));
        // 0,0 is starting point and 1,0 is the position querying adjacent to
        board.addCard(getPassageCrossroads(), new Position(2, 0));
        board.addCard(getDeadendCrossroads(), new Position(0, -1));
        board.addCard(getPassageCrossroads(), new Position(1, -1));
        board.addCard(getDeadendCrossroads(), new Position(2, -1));
      });

      it("returns surrounding cards", () => {
        expect(board.getAdjacentCards(new Position(1, 0))).toMatchSnapshot();
      });
    });
  });
});
