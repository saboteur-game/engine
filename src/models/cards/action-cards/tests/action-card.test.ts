import Position from "../../../position";
import CardParameters from "../../card-parameters";
import ActionCard from "../action-card";

const PLAY_POSITION = new Position(0, 1);

describe("ActionCard", () => {
  let actionCard: ActionCard;
  let cardParameters: CardParameters;

  beforeEach(() => {
    actionCard = new ActionCard();
    cardParameters = { position: PLAY_POSITION };
  });

  it("can be serialized", () => {
    expect(actionCard.toJSON()).toMatchSnapshot();
  });

  describe("play a card", () => {
    it("returns the played card", () => {
      expect(actionCard.play(cardParameters)).toBe(actionCard);
    });
  });
});
