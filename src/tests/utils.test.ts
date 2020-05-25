// Utils is mocked in test setup
const { generateId, shuffle } = jest.requireActual("../utils");

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
      expect(shuffledArray).not.toEqual(array);
      expect(shuffledArray).toHaveLength(5);
    });
  });
});
