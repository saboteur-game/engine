let count = 0;
let resetValue: number;

global.beforeAll(() => {
  // Some models will have had instances created in mocks before the tests have
  // been set up. If we reset back to 0, then there's a possibility that we'll
  // get an ID collision with one of these instances. Instead, this will be our
  // new baseline value and we'll increment from here for each test.
  resetValue = count;
});

jest.mock("../src/utils", () =>
  Object.assign(jest.requireActual("../src/utils"), {
    generateId: () => `test-id-${count++}`,
    shuffle: jest.fn().mockImplementation(<T>(value: T): T => value),
  })
);

global.beforeEach(() => {
  count = resetValue;
});
