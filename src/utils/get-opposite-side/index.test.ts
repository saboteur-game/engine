import { Sides } from "../../models/cards/card";
import { getOppositeSide } from ".";

describe("getOppositeSide", () => {
  it("returns bottom given top", () => {
    expect(getOppositeSide(Sides.top)).toBe(Sides.bottom);
  });

  it("returns left given right", () => {
    expect(getOppositeSide(Sides.right)).toBe(Sides.left);
  });

  it("returns top given bottom", () => {
    expect(getOppositeSide(Sides.bottom)).toBe(Sides.top);
  });

  it("returns right given left", () => {
    expect(getOppositeSide(Sides.left)).toBe(Sides.right);
  });

  it("throw execption given unknown side", () => {
    expect(() => getOppositeSide(0)).toThrow("Unknown side");
  });
});
