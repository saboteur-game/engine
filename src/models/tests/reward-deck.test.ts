import { mocked } from "ts-jest/utils";
import RewardDeck from "../reward-deck";
import { shuffle } from "../../utils";
import GoldRewardCard from "../cards/gold-reward-cards";

const mockedShuffle = mocked(shuffle);

describe("RewardDeck", () => {
  let rewardDeck: RewardDeck;

  it("can be serialized", () => {
    expect(new RewardDeck().toJS()).toMatchSnapshot();
  });

  describe("drawCard", () => {
    describe("draw card when the pile is populated", () => {
      beforeEach(() => {
        rewardDeck = new RewardDeck();
      });

      it("draws a card from the deck and returns it", () => {
        expect(rewardDeck.getCardCount()).toBe(28);
        expect(rewardDeck.drawCard()).toMatchInlineSnapshot(`
          GoldRewardCard {
            "id": "test-id-1",
            "value": 3,
          }
        `);
        expect(rewardDeck.getCardCount()).toBe(27);
      });
    });

    describe("draw card when the pile is empty", () => {
      beforeEach(() => {
        mockedShuffle.mockReturnValue([]);
        rewardDeck = new RewardDeck();
      });

      it("returns undefined", () => {
        expect(rewardDeck.getCardCount()).toBe(0);
        expect(rewardDeck.drawCard()).toBe(undefined);
        expect(rewardDeck.getCardCount()).toBe(0);
      });
    });
  });

  describe("extractCardsToValue", () => {
    // e.g. cards [2,3,1,1] => to match 4 should return 2,1,1
    describe("when matching a combination of cards from the initial card", () => {
      beforeEach(() => {
        mockedShuffle.mockReturnValue([
          new GoldRewardCard(2),
          new GoldRewardCard(3),
          new GoldRewardCard(1),
          new GoldRewardCard(1),
          new GoldRewardCard(2),
        ]);
        rewardDeck = new RewardDeck();
      });

      it("draws cards up to a specific value", () => {
        expect(rewardDeck.getCardCount()).toBe(5);
        expect(rewardDeck.extractCardsToValue(4)).toMatchInlineSnapshot(`
          Array [
            GoldRewardCard {
              "id": "test-id-0",
              "value": 2,
            },
            GoldRewardCard {
              "id": "test-id-2",
              "value": 1,
            },
            GoldRewardCard {
              "id": "test-id-3",
              "value": 1,
            },
          ]
        `);
        expect(rewardDeck.getCardCount()).toBe(2);
      });
    });

    // e.g. cards [2,3,1,3] => to match 4 should return 3,1
    describe("when matching a combination of cards from not initial card", () => {
      beforeEach(() => {
        mockedShuffle.mockReturnValue([
          new GoldRewardCard(2),
          new GoldRewardCard(3),
          new GoldRewardCard(1),
          new GoldRewardCard(3),
        ]);
        rewardDeck = new RewardDeck();
      });

      it("draws cards up to a specific value", () => {
        expect(rewardDeck.getCardCount()).toBe(4);
        expect(rewardDeck.extractCardsToValue(4)).toMatchInlineSnapshot(`
          Array [
            GoldRewardCard {
              "id": "test-id-1",
              "value": 3,
            },
            GoldRewardCard {
              "id": "test-id-2",
              "value": 1,
            },
          ]
        `);
        expect(rewardDeck.getCardCount()).toBe(2);
      });
    });

    // e.g. cards [3,3,3,2] => to match 2 should return 2
    describe("when matching a single card which is last", () => {
      beforeEach(() => {
        mockedShuffle.mockReturnValue([
          new GoldRewardCard(3),
          new GoldRewardCard(3),
          new GoldRewardCard(3),
          new GoldRewardCard(2),
        ]);
        rewardDeck = new RewardDeck();
      });

      it("draws cards up to a specific value", () => {
        expect(rewardDeck.getCardCount()).toBe(4);
        expect(rewardDeck.extractCardsToValue(2)).toMatchInlineSnapshot(`
          Array [
            GoldRewardCard {
              "id": "test-id-3",
              "value": 2,
            },
          ]
        `);
        expect(rewardDeck.getCardCount()).toBe(3);
      });
    });

    // e.g. cards [2,3,3] => to match 4 should return 3,1 (1 being generated)
    describe("when matching a combination of cards which required generated gold", () => {
      beforeEach(() => {
        mockedShuffle.mockReturnValue([
          new GoldRewardCard(2),
          new GoldRewardCard(3),
          new GoldRewardCard(3),
        ]);
        rewardDeck = new RewardDeck();
      });

      it("draws cards up to a specific value", () => {
        expect(rewardDeck.getCardCount()).toBe(3);
        expect(rewardDeck.extractCardsToValue(4)).toMatchInlineSnapshot(`
          Array [
            GoldRewardCard {
              "id": "test-id-2",
              "value": 3,
            },
            GoldRewardCard {
              "id": "test-id-32",
              "value": 1,
            },
          ]
        `);
        expect(rewardDeck.getCardCount()).toBe(2);
      });
    });

    // e.g. cards [2,3,3] => to match 4 should return 3,1 (1 being generated)
    describe("when matching a combination of cards which requires all generated gold", () => {
      beforeEach(() => {
        mockedShuffle.mockReturnValue([
          new GoldRewardCard(3),
          new GoldRewardCard(3),
          new GoldRewardCard(3),
        ]);
        rewardDeck = new RewardDeck();
      });

      it("draws cards up to a specific value", () => {
        expect(rewardDeck.getCardCount()).toBe(3);
        expect(rewardDeck.extractCardsToValue(2)).toMatchInlineSnapshot(`
          Array [
            GoldRewardCard {
              "id": "test-id-32",
              "value": 1,
            },
            GoldRewardCard {
              "id": "test-id-33",
              "value": 1,
            },
          ]
        `);
        expect(rewardDeck.getCardCount()).toBe(3);
      });
    });

    // e.g. cards [2,3,1,2] => to match 4 should return 2,2
    describe("when matching a combination of cards which is spread across the deck", () => {
      beforeEach(() => {
        mockedShuffle.mockReturnValue([
          new GoldRewardCard(2),
          new GoldRewardCard(3),
          new GoldRewardCard(1),
          new GoldRewardCard(2),
        ]);
        rewardDeck = new RewardDeck();
      });

      it("draws cards up to a specific value", () => {
        expect(rewardDeck.getCardCount()).toBe(4);
        expect(rewardDeck.extractCardsToValue(4)).toMatchInlineSnapshot(`
          Array [
            GoldRewardCard {
              "id": "test-id-0",
              "value": 2,
            },
            GoldRewardCard {
              "id": "test-id-3",
              "value": 2,
            },
          ]
        `);
        expect(rewardDeck.getCardCount()).toBe(2);
      });
    });
  });
});
