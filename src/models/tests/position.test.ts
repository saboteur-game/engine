import Position from "../position";

describe("Position", () => {
  it("can be serialized", () => {
    expect(new Position(1, 2).toJS()).toMatchSnapshot();
  });

  it("can be stringified", () => {
    expect(new Position(1, 2).toString()).toBe("1,2");
  });
});
