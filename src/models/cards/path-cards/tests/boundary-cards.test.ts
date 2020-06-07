import { Sides } from "../../card";
import {
  StartPathCard,
  GoldFinishPathCard,
  RockFinishPathCard,
  FinishPathCard,
} from "..";

describe("Boundary Cards", () => {
  describe("StartPathCard", () => {
    it("can be visualized", () => {
      expect(new StartPathCard().visualize()).toMatchSnapshot();
    });
  });

  describe("FinishPathCard", () => {
    let card: FinishPathCard;

    beforeEach(() => {
      card = new FinishPathCard([Sides.top, Sides.right]);
    });

    it("is face down by default", () => {
      expect(card.isFaceDown).toBe(true);
    });

    describe("turnOver", () => {
      describe("when connected to on a side with a connector", () => {
        beforeEach(() => {
          card.turnOver(Sides.top);
        });

        it("turns over the card and does not rotate", () => {
          expect(card.isFaceDown).toBe(false);
          expect(card.isUpsideDown).toBe(false);
        });
      });

      describe("when connected to on a side without a connector", () => {
        beforeEach(() => {
          card.turnOver(Sides.bottom);
        });

        it("turns over the card and rotates to match connector", () => {
          expect(card.isFaceDown).toBe(false);
          expect(card.isUpsideDown).toBe(true);
        });
      });
    });
  });

  describe("GoldFinishPathCard", () => {
    let card: GoldFinishPathCard;

    beforeEach(() => {
      card = new GoldFinishPathCard();
    });

    describe("when face down", () => {
      it("can be visualized", () => {
        expect(card.visualize()).toMatchSnapshot();
      });
    });

    describe("when face up", () => {
      beforeEach(() => {
        card.turnOver(Sides.left);
      });

      it("can be visualized", () => {
        expect(card.visualize()).toMatchSnapshot();
      });
    });
  });

  describe("RockFinishPathCard", () => {
    let cardRightSideUp: RockFinishPathCard;
    let cardUpsideDown: RockFinishPathCard;

    beforeEach(() => {
      cardRightSideUp = new RockFinishPathCard([Sides.top, Sides.right], false);
      cardUpsideDown = new RockFinishPathCard([Sides.top, Sides.right], true);
    });

    describe("when face down", () => {
      it("can be visualized right side up", () => {
        expect(cardRightSideUp.visualize()).toMatchSnapshot();
      });

      it("can be visualized upside down", () => {
        expect(cardUpsideDown.visualize()).toMatchSnapshot();
      });
    });

    describe("when face up", () => {
      beforeEach(() => {
        cardRightSideUp.turnOver(Sides.top);
        cardUpsideDown.turnOver(Sides.top);
      });

      it("can be visualized right side up", () => {
        expect(cardRightSideUp.visualize()).toMatchSnapshot();
      });

      it("can be visualized upside down", () => {
        expect(cardUpsideDown.visualize()).toMatchSnapshot();
      });
    });
  });
});
