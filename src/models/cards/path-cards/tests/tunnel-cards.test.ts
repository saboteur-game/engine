import { Sides } from "../../card";
import { PassageCard, DeadendCard } from "..";

describe("Tunnel Cards", () => {
  describe("PassageCard", () => {
    const passageConfigurations = [
      [[Sides.right, Sides.left]],
      [[Sides.top, Sides.bottom]],
      [[Sides.top, Sides.left]],
      [[Sides.top, Sides.right]],
      [[Sides.top, Sides.right, Sides.left]],
      [[Sides.top, Sides.right, Sides.bottom]],
      [[Sides.top, Sides.right, Sides.bottom, Sides.left]],
    ];

    describe.each([
      ["right side up", false],
      ["upside down", true],
    ])("%s", (message, direction) => {
      describe.each(passageConfigurations)(
        "with %p configuration",
        (connections) => {
          it("can be visualized", () => {
            expect(
              new PassageCard(connections, direction).visualize()
            ).toMatchSnapshot();
          });
        }
      );
    });
  });

  describe("DeadendCard", () => {
    const deadendConfigurations = [
      [[Sides.top]],
      [[Sides.right]],
      [[Sides.top, Sides.right]],
      [[Sides.top, Sides.bottom]],
      [[Sides.top, Sides.left]],
      [[Sides.right, Sides.left]],
      [[Sides.top, Sides.right, Sides.bottom]],
      [[Sides.top, Sides.right, Sides.left]],
      [[Sides.top, Sides.right, Sides.bottom, Sides.left]],
    ];

    describe.each([
      ["right side up", false],
      ["upside down", true],
    ])("%s", (message, direction) => {
      describe.each(deadendConfigurations)(
        "with %p configuration",
        (connections) => {
          it("can be visualized", () => {
            expect(
              new DeadendCard(connections, direction).visualize()
            ).toMatchSnapshot();
          });
        }
      );
    });
  });
});
