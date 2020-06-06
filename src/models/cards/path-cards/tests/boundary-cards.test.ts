import { Sides } from "../../card";
import { StartPathCard, GoldFinishPathCard, RockFinishPathCard } from "..";

describe("Boundary Cards", () => {
  describe("StartPathCard", () => {
    it("can be visualized", () => {
      expect(new StartPathCard().visualize()).toMatchSnapshot();
    });
  });

  describe("GoldFinishPathCard", () => {
    it("can be visualized", () => {
      expect(new GoldFinishPathCard().visualize()).toMatchSnapshot();
    });
  });

  describe("GoldFinishPathCard", () => {
    it("can be visualized right side up", () => {
      expect(
        new RockFinishPathCard([Sides.top, Sides.right], false).visualize()
      ).toMatchSnapshot();
    });

    it("can be visualized upside down", () => {
      expect(
        new RockFinishPathCard([Sides.top, Sides.right], true).visualize()
      ).toMatchSnapshot();
    });
  });
});
