import Position from "../../../position";
import CardParameters from "../../card-parameters";
import PathCard from "../path-card";
import { Sides } from "../../card";

const PLAY_POSITION = new Position(0, 1);

describe("PathCard", () => {
  let pathCard: PathCard;
  let cardParameters: CardParameters;

  beforeEach(() => {
    pathCard = new PathCard([Sides.top, Sides.right, Sides.bottom, Sides.left]);
    cardParameters = { position: PLAY_POSITION };
  });

  it("can be serialized", () => {
    expect(pathCard.toJS()).toMatchSnapshot();
  });

  it("does not implement visalization", () => {
    expect(() => pathCard.visualize()).toThrow("Not implemented");
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
