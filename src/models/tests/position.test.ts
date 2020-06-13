import Position from "../position";

describe("Position", () => {
  it("can be serialized", () => {
    expect(new Position(1, 2).toJSON()).toMatchSnapshot();
  });

  it("can be stringified", () => {
    expect(new Position(1, 2).toString()).toBe("1,2");
  });

  it("returns the position above", () => {
    expect(new Position(0, 0).above()).toMatchInlineSnapshot(`
      Object {
        "id": "test-id-1",
        "x": 0,
        "y": 1,
      }
    `);
  });

  it("returns the position below", () => {
    expect(new Position(0, 0).below()).toMatchInlineSnapshot(`
      Object {
        "id": "test-id-1",
        "x": 0,
        "y": -1,
      }
    `);
  });

  it("returns the position left", () => {
    expect(new Position(0, 0).left()).toMatchInlineSnapshot(`
      Object {
        "id": "test-id-1",
        "x": -1,
        "y": 0,
      }
    `);
  });

  it("returns the position right", () => {
    expect(new Position(0, 0).right()).toMatchInlineSnapshot(`
      Object {
        "id": "test-id-1",
        "x": 1,
        "y": 0,
      }
    `);
  });
});
