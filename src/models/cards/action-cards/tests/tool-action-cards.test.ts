import Player from "../../../player";
import { Tools } from "../../../../constants";
import { IToolActionCardParameters } from "../../card-parameters";
import { ToolActionCard } from "../tool-action-cards";

describe("ToolActionCard", () => {
  let toolActionCard: ToolActionCard;
  let cardParameters: IToolActionCardParameters;

  beforeEach(() => {
    toolActionCard = new ToolActionCard(Tools.lamp);
  });

  it("can be serialized", () => {
    expect(toolActionCard.toJSON()).toMatchSnapshot();
  });

  describe("play a card", () => {
    describe("applied to a matching tool", () => {
      beforeEach(() => {
        cardParameters = { player: new Player("Alice"), appliedTo: Tools.lamp };
      });

      it("returns the played card", () => {
        expect(toolActionCard.play(cardParameters)).toBe(toolActionCard);
      });
    });

    describe("applied to a different tool", () => {
      beforeEach(() => {
        cardParameters = { player: new Player("Alice"), appliedTo: Tools.pick };
      });

      it("throws exception", () => {
        expect(() => toolActionCard.play(cardParameters)).toThrow(
          "Invalid parameter provided. Cannot apply to pick"
        );
      });
    });
  });
});
