import Discard from "../discard";
import { MapActionCard } from "../cards/action-cards";

describe("Discard", () => {
  let card: MapActionCard;
  let discard: Discard;

  beforeEach(() => {
    card = new MapActionCard();
    discard = new Discard();
  });

  it("can be serialized", () => {
    expect(discard.toJSON()).toMatchSnapshot();
  });

  describe("addPlayed", () => {
    it("adds the card to the discard pile", () => {
      expect(discard.getCardCount()).toBe(0);
      expect(card.status).toBe("unused");

      discard.addPlayed(card);

      expect(discard.getCardCount()).toBe(1);
      expect(card.status).toBe("played");
    });
  });

  describe("addDiscarded", () => {
    it("adds the card to the discard pile", () => {
      expect(discard.getCardCount()).toBe(0);
      expect(card.status).toBe("unused");

      discard.addDiscarded(card);

      expect(discard.getCardCount()).toBe(1);
      expect(card.status).toBe("discarded");
    });
  });

  describe("getTopCard", () => {
    describe("when there are no cards on the discard pile", () => {
      it("returns undefined", () => {
        expect(discard.getTopCard()).toBe(undefined);
      });
    });

    describe("when the card has been played", () => {
      beforeEach(() => {
        discard.addPlayed(card);
      });

      it("returns the played card", () => {
        expect(discard.getTopCard()).toBe(card);
      });
    });

    describe("when the card has been discarded", () => {
      beforeEach(() => {
        discard.addDiscarded(card);
      });

      it("returns null for a card discarded face-down", () => {
        expect(discard.getTopCard()).toBe(null);
      });
    });
  });
});
