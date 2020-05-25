jest.mock("../src/utils", () => ({
  generateId: () => "test-id",
  shuffle: <T>(value: T): T => value,
}));
