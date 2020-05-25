import Game from "../game";

jest.spyOn(global.Math, "random").mockReturnValue(0.5);

describe("Game", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  it("can be serialized", () => {
    expect(game.toJS()).toMatchSnapshot();
  });
});
