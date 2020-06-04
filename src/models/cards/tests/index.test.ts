import { getShuffledDeck } from "..";

jest.spyOn(global.Math, "random").mockReturnValue(0.5);

describe("cards", () => {
  describe("getShuffledDeck", () => {
    it("returns a full deck", () => {
      const deck = getShuffledDeck();
      expect(deck.length).toBe(67);
      expect(deck).toMatchSnapshot();
    });
  });
});
