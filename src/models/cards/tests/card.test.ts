import Position from "../../position";
import CardParameters from "../card-parameters";
import Card from "../card";

const PLAY_POSITION = new Position(0, 1);

describe("Card", () => {
  let card: Card;
  let cardParameters: CardParameters;

  beforeEach(() => {
    card = new Card();
    cardParameters = { position: PLAY_POSITION };
  });

  it("can be serialized", () => {
    expect(card.toJS()).toMatchSnapshot();
  });

  describe("play a card", () => {
    it("returns the played card", () => {
      expect(card.play(cardParameters)).toBe(card);
    });
  });

  describe("set card as discarded", () => {
    describe("when the card is unused", () => {
      it("sets the card to discarded", () => {
        expect(card.status).toBe("unused");
        card.setDiscarded();
        expect(card.status).toBe("discarded");
      });
    });

    describe("when the card is played", () => {
      beforeEach(() => {
        card.setPlayed();
      });

      it("throws exception", () => {
        expect(() => card.setDiscarded()).toThrow(
          "Card in unknown state to set as discarded"
        );
      });
    });

    describe("when the card is discarded", () => {
      beforeEach(() => {
        card.setDiscarded();
      });

      it("throws exception", () => {
        expect(() => card.setDiscarded()).toThrow(
          "Card in unknown state to set as discarded"
        );
      });
    });
  });

  describe("set card as played", () => {
    describe("when the card is unused", () => {
      it("sets the card to played", () => {
        expect(card.status).toBe("unused");
        card.setPlayed();
        expect(card.status).toBe("played");
      });
    });

    describe("when the card is played", () => {
      beforeEach(() => {
        card.setPlayed();
      });

      it("sets the card to played", () => {
        expect(card.status).toBe("played");
        card.setPlayed();
        expect(card.status).toBe("played");
      });
    });

    describe("when the card is discarded", () => {
      beforeEach(() => {
        card.setDiscarded();
      });

      it("throws exception", () => {
        expect(() => card.setPlayed()).toThrow(
          "Card in unknown state to set as played"
        );
      });
    });
  });
});
