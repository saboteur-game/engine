import CardParameters from "../../card-parameters";
import ActionCard from "../action-card";

describe("ActionCard", () => {
  let actionCard: ActionCard;
  let cardParameters: CardParameters;

  beforeEach(() => {
    actionCard = new ActionCard();
    cardParameters = { position: "0,0" };
  });

  it("can be serialized", () => {
    expect(actionCard.toJS()).toMatchSnapshot();
  });

  describe("play a card", () => {
    it("returns the played card", () => {
      expect(actionCard.play(cardParameters)).toBe(actionCard);
    });
  });
});
