import { mocked } from "ts-jest/utils";
import Deck from "../deck";
import { getShuffledDeck } from "../cards";
import { PassageCard } from "../cards/path-cards";
import { Sides } from "../cards/card";

const mockedGetSuffledDeck = mocked(getShuffledDeck);

jest.mock("../cards");

describe("Deck", () => {
  let deck: Deck;
  let card: PassageCard;

  beforeEach(() => {
    card = new PassageCard([Sides.top, Sides.right, Sides.bottom, Sides.left]);
    mockedGetSuffledDeck.mockReturnValue([card]);
  });

  it("can be serialized", () => {
    expect(new Deck().toJS()).toMatchSnapshot();
  });

  describe("draw card when the pile is populated", () => {
    beforeEach(() => {
      deck = new Deck();
    });

    it("draws a card from the deck and returns it", () => {
      expect(deck.getCardCount()).toBe(1);
      expect(deck.drawCard()).toBe(card);
      expect(deck.getCardCount()).toBe(0);
    });
  });

  describe("draw card when the pile is empty", () => {
    beforeEach(() => {
      mockedGetSuffledDeck.mockReturnValue([]);
      deck = new Deck();
    });

    it("returns undefined", () => {
      expect(deck.getCardCount()).toBe(0);
      expect(deck.drawCard()).toBe(undefined);
      expect(deck.getCardCount()).toBe(0);
    });
  });
});
