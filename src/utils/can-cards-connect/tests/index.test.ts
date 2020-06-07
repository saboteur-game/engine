import {
  PassageCard,
  DeadendCard,
  TunnelCard,
  RockFinishPathCard,
} from "../../../models/cards/path-cards";
import { Sides } from "../../../models/cards/card";
import canCardsConnect from "..";

const sideName = ["top", "right", "bottom", "left"];

describe("check two cards can connect", () => {
  describe("when connecting with an empty space", () => {
    it("can connect", () => {
      const card = new PassageCard([
        Sides.top,
        Sides.right,
        Sides.bottom,
        Sides.left,
      ]);
      const adjacentCard = undefined;
      expect(canCardsConnect(0, adjacentCard, card)).toBe(true);
    });
  });

  const commonTestCases = [
    [
      "which always has common connectors",
      [Sides.top, Sides.right, Sides.bottom, Sides.left],
      [Sides.top, Sides.right, Sides.bottom, Sides.left],
      [true, true, true, true],
    ],
    [
      "which never has common connectors",
      [Sides.right, Sides.left],
      [Sides.top, Sides.bottom],
      [false, false, false, false],
    ],
    [
      "which always has common connectors or common spaces",
      [Sides.top, Sides.bottom],
      [Sides.top, Sides.bottom],
      [true, true, true, true],
    ],
  ] as [string, Sides[], Sides[], boolean[]][];

  describe.each([
    [PassageCard, PassageCard],
    [PassageCard, DeadendCard],
    [DeadendCard, PassageCard],
    [DeadendCard, DeadendCard],
  ] as typeof TunnelCard[][])(
    "when connecting %p with %p",
    (AdjacentCardType: typeof TunnelCard, CardType: typeof TunnelCard) => {
      describe("when both cards are right side up", () => {
        describe.each([
          ...commonTestCases,
          [
            "which has some common connectors and spaces",
            [Sides.bottom, Sides.left],
            [Sides.right, Sides.bottom],
            [false, true, false, true],
          ],
        ])(
          "when connecting to a card %s",
          (
            message: string,
            adjacentConnectors: Sides[],
            cardConnectors: Sides[],
            expectations: boolean[]
          ) => {
            expectations.forEach((expectation, index) => {
              it(`${
                expectation ? "can" : "cannot"
              } connect when placed on the ${sideName[index]}`, () => {
                const adjacentCard = new AdjacentCardType(adjacentConnectors);
                const card = new CardType(cardConnectors);

                expect(canCardsConnect(index + 1, adjacentCard, card)).toBe(
                  expectation
                );
              });
            });
          }
        );
      });

      describe("when played card is upside down", () => {
        describe.each([
          ...commonTestCases,
          [
            "which has some common connectors and spaces",
            [Sides.bottom, Sides.left],
            [Sides.right, Sides.bottom],
            [true, false, true, false],
          ],
        ])(
          "when connecting to a card %s",
          (message, adjacentConnectors, cardConnectors, expectations) => {
            expectations.forEach((expectation, index) => {
              it(`${
                expectation ? "can" : "cannot"
              } connect when placed on the ${sideName[index]}`, () => {
                const adjacentCard = new PassageCard(adjacentConnectors);
                const card = new PassageCard(cardConnectors);
                card.rotate();

                expect(canCardsConnect(index + 1, adjacentCard, card)).toBe(
                  expectation
                );
              });
            });
          }
        );
      });

      describe("when adjacent card is upside down", () => {
        describe.each([
          ...commonTestCases,
          [
            "which has some common connectors and spaces",
            [Sides.bottom, Sides.left],
            [Sides.right, Sides.bottom],
            [true, false, true, false],
          ],
        ])(
          "when connecting to a card %s",
          (message, adjacentConnectors, cardConnectors, expectations) => {
            expectations.forEach((expectation, index) => {
              it(`${
                expectation ? "can" : "cannot"
              } connect when placed on the ${sideName[index]}`, () => {
                const adjacentCard = new PassageCard(adjacentConnectors);
                const card = new PassageCard(cardConnectors);
                adjacentCard.rotate();

                expect(canCardsConnect(index + 1, adjacentCard, card)).toBe(
                  expectation
                );
              });
            });
          }
        );
      });

      describe("when both cards are upside down", () => {
        describe.each([
          ...commonTestCases,
          [
            "which has some common connectors and spaces",
            [Sides.bottom, Sides.left],
            [Sides.right, Sides.bottom],
            [false, true, false, true],
          ],
        ])(
          "when connecting to a card %s",
          (message, adjacentConnectors, cardConnectors, expectations) => {
            expectations.forEach((expectation, index) => {
              it(`${
                expectation ? "can" : "cannot"
              } connect when placed on the ${sideName[index]}`, () => {
                const adjacentCard = new PassageCard(adjacentConnectors);
                const card = new PassageCard(cardConnectors);
                card.rotate();
                adjacentCard.rotate();

                expect(canCardsConnect(index + 1, adjacentCard, card)).toBe(
                  expectation
                );
              });
            });
          }
        );
      });
    }
  );

  describe("connecting to a final card", () => {
    let adjacentCard: RockFinishPathCard;
    let card: PassageCard;

    beforeEach(() => {
      adjacentCard = new RockFinishPathCard([Sides.top, Sides.right]);
      card = new PassageCard([Sides.right, Sides.left]);
    });

    describe("when the final card is face down", () => {
      it("connects when connectors match", () => {
        expect(canCardsConnect(Sides.left, adjacentCard, card)).toBe(true);
      });

      it("connects when connectors don't match", () => {
        expect(canCardsConnect(Sides.right, adjacentCard, card)).toBe(true);
      });
    });

    describe("when the final card is face up", () => {
      beforeEach(() => {
        adjacentCard.turnOver(Sides.top);
      });

      it("connects when connectors match", () => {
        expect(canCardsConnect(Sides.left, adjacentCard, card)).toBe(true);
      });

      it("connects when connectors don't match", () => {
        expect(canCardsConnect(Sides.right, adjacentCard, card)).toBe(false);
      });
    });
  });
});
