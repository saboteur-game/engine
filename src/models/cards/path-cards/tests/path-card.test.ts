import Position from "../../../position";
import CardParameters from "../../card-parameters";
import PathCard from "../path-card";

const PLAY_POSITION = new Position(0, 1);

describe("PathCard", () => {
  let pathCard: PathCard;
  let cardParameters: CardParameters;

  beforeEach(() => {
    pathCard = new PathCard([1, 2, 3, 4]);
    cardParameters = { position: PLAY_POSITION };
  });

  it("can be serialized", () => {
    expect(pathCard.toJS()).toMatchSnapshot();
  });

  it("can be rotated", () => {
    expect(pathCard.isUpsideDown).toBe(false);
    pathCard.rotate();
    expect(pathCard.isUpsideDown).toBe(true);
  });

  describe("play a card", () => {
    it("returns the played card", () => {
      expect(pathCard.play(cardParameters)).toBe(pathCard);
    });
  });
});
