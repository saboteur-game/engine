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
    expect(discard.toJS()).toMatchSnapshot();
  });

  describe("adding a played card", () => {
    it("adds the card to the discard pile", () => {
      expect(discard.getCardCount()).toBe(0);
      expect(card.status).toBe("unused");

      discard.addPlayed(card);

      expect(discard.getCardCount()).toBe(1);
      expect(card.status).toBe("played");
    });
  });

  describe("adding a discarding a card", () => {
    it("adds the card to the discard pile", () => {
      expect(discard.getCardCount()).toBe(0);
      expect(card.status).toBe("unused");

      discard.addDiscarded(card);

      expect(discard.getCardCount()).toBe(1);
      expect(card.status).toBe("discarded");
    });
  });
});
