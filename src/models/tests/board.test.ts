import Board, { startPosition, middleFinishPosition } from "../board";
import Position from "../position";
import {
  PathCard,
  FinishPathCard,
  StartPathCard,
  PassageCard,
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
});
