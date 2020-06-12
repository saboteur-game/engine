// Utils is mocked in test setup
const { generateId, shuffle, multiply, wrapIndexAt } = jest.requireActual("..");

describe("utils", () => {
  describe("generateId", () => {
    it("generates an ID", () => {
      const id = generateId();
      expect(id).toHaveLength(36);
      expect(id).toMatch(/.+-.+-.+-.+-.+/);
    });
  });

  describe("shuffle", () => {
    it("shuffles the elements in an array", () => {
      const array = [1, 2, 3, 4, 5];
      const shuffledArray = shuffle(array);
      expect(shuffledArray).not.toEqual(shuffle(array));
      expect(shuffledArray).toHaveLength(5);
    });
  });

  describe("multiply", () => {
    it("returns an array of values from function", () => {
      expect(multiply(5, () => "test")).toEqual([
        "test",
        "test",
        "test",
        "test",
        "test",
      ]);
    });
  });

  describe("wrapIndexAt", () => {
    it("returns index within bounds when provided index larger than max", () => {
      expect(wrapIndexAt(10)(12)).toBe(2);
    });

    it("returns index within bounds when provided index much larger than max", () => {
      expect(wrapIndexAt(10)(22)).toBe(2);
    });

    it("returns index within bounds when provided index smaller than zero", () => {
      expect(wrapIndexAt(10)(-2)).toBe(8);
    });

    it("returns index within bounds when provided index much smaller than zero", () => {
      expect(wrapIndexAt(10)(-12)).toBe(8);
    });

    it("returns index provided when within bounds", () => {
      expect(wrapIndexAt(10)(5)).toBe(5);
    });
  });
});
