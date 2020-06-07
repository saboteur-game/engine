let count = 0;
jest.mock("../src/utils", () => ({
  generateId: () => `test-id-${count++}`,
  shuffle: <T>(value: T): T => value,
}));

global.beforeEach(() => {
  count = 0;
});
