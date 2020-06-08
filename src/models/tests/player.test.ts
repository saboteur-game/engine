import Player from "../player";
import { MapActionCard } from "../cards/action-cards";
import { Tools } from "../../constants";
import { FinishPathCard, RockFinishPathCard } from "../cards/path-cards";
import Position from "../position";
import { Sides } from "../cards/card";

const PLAY_POSITION = new Position(0, 1);

describe("Player", () => {
  let card: MapActionCard;
  let player: Player;

  beforeEach(() => {
    card = new MapActionCard();
    player = new Player("Alice", 35);
  });

  it("can be serialized", () => {
    expect(player.toJS()).toMatchSnapshot();
  });

  it("will be provided random age if unspecified", () => {
    const { age } = new Player("Bob");
    expect(age).toBeGreaterThanOrEqual(8);
    expect(age).toBeLessThanOrEqual(90);
  });

  describe("addToHand", () => {
    it("adds the card to the players hand", () => {
      expect(player.getHandCardCount()).toBe(0);
      player.addToHand(card);
      expect(player.getHandCardCount()).toBe(1);
    });
  });

  describe("removeFromHand", () => {
    describe("when the card is in the players hand", () => {
      beforeEach(() => {
        player.addToHand(card);
      });

      it("removes the card from the players hand", () => {
        expect(player.getHandCardCount()).toBe(1);
        player.removeFromHand(card.id);
        expect(player.getHandCardCount()).toBe(0);
      });
    });

    describe("when the card is not in the players hand", () => {
      it("throws exception", () => {
        expect(() => player.removeFromHand(card.id)).toThrow(
          "Cannot remove card which isn't in players hand"
        );
      });
    });
  });

  describe("addToHand", () => {
    describe("when there are no cards in the players hand", () => {
      it("returns empty array", () => {
        expect(player.getHand()).toEqual([]);
      });
    });

    describe("when there are cards in the players hand", () => {
      beforeEach(() => {
        player.addToHand(card);
      });

      it("returns populated array", () => {
        expect(player.getHand()).toMatchSnapshot();
      });
    });
  });

  describe("playCard", () => {
    beforeEach(() => {
      player.addToHand(card);
    });

    describe("when card is not in the players hand", () => {
      it("throws exception", () => {
        expect(() =>
          player.playCard("test-card-id-123", { position: PLAY_POSITION })
        ).toThrow("Cannot play card which isn't in players hand");
      });
    });

    describe("when card is in the players hand", () => {
      it("returns played card with parameters", () => {
        expect(card.parameters).toBe(undefined);
        expect(player.playCard(card.id, { position: PLAY_POSITION })).toBe(
          card
        );
        expect(card.parameters).toEqual({ position: PLAY_POSITION });
      });
    });
  });

  describe("discardCard", () => {
    beforeEach(() => {
      player.addToHand(card);
    });

    describe("when card is not in the players hand", () => {
      it("throws exception", () => {
        expect(() => player.discardCard("test-card-id-123")).toThrow(
          "Cannot discard card which isn't in players hand"
        );
      });
    });

    describe("when card is in the players hand", () => {
      it("returns discarded card and removes it from the players hand", () => {
        expect(player.getHandCardCount()).toBe(1);
        expect(player.discardCard(card.id)).toBe(card);
        expect(player.getHandCardCount()).toBe(0);
      });
    });
  });

  describe("breakTool", () => {
    describe("when tool is not already broken", () => {
      it("sets the corresponding tool to off", () => {
        expect(player.getTools()).toMatchInlineSnapshot(`
          Object {
            "lamp": true,
            "pick": true,
            "wagon": true,
          }
        `);
        player.breakTool(Tools.lamp);
        expect(player.getTools()).toMatchInlineSnapshot(`
          Object {
            "lamp": false,
            "pick": true,
            "wagon": true,
          }
        `);
      });
    });

    describe("when tool is already broken", () => {
      beforeEach(() => {
        player.breakTool(Tools.lamp);
      });

      it("throw exception", () => {
        expect(() => player.breakTool(Tools.lamp)).toThrow(
          "Tool lamp is already broken"
        );
      });
    });
  });

  describe("repairTool", () => {
    describe("when tool is not already repaired", () => {
      beforeEach(() => {
        player.breakTool(Tools.lamp);
      });

      it("sets the corresponding tool to off", () => {
        expect(player.getTools()).toMatchInlineSnapshot(`
          Object {
            "lamp": false,
            "pick": true,
            "wagon": true,
          }
        `);
        player.repairTool(Tools.lamp);
        expect(player.getTools()).toMatchInlineSnapshot(`
          Object {
            "lamp": true,
            "pick": true,
            "wagon": true,
          }
        `);
      });
    });

    describe("when tool is already repaired", () => {
      it("throw exception", () => {
        expect(() => player.repairTool(Tools.lamp)).toThrow(
          "Tool lamp does not need repaired"
        );
      });
    });
  });

  describe("setup", () => {
    let finishCard: RockFinishPathCard;

    beforeEach(() => {
      finishCard = new RockFinishPathCard([Sides.top]);
      player.viewFinishCard(finishCard);
      player.addToHand(card);
      player.breakTool(Tools.pick);
      player.breakTool(Tools.lamp);
      player.breakTool(Tools.wagon);
    });

    it("resets the players hand", () => {
      expect(player.getHand()).toEqual([card]);
      player.setup(false);
      expect(player.getHand()).toEqual([]);
    });

    it("resets broken tools", () => {
      expect(player.getTools()).toMatchInlineSnapshot(`
        Object {
          "lamp": false,
          "pick": false,
          "wagon": false,
        }
      `);
      player.setup(false);
      expect(player.getTools()).toMatchInlineSnapshot(`
        Object {
          "lamp": true,
          "pick": true,
          "wagon": true,
        }
      `);
    });

    it("resets any viewed finish cards", () => {
      expect(player.getViewedFinishCards()).toEqual([finishCard]);
      player.setup(false);
      expect(player.getViewedFinishCards()).toEqual([]);
    });

    it("sets player to saboteur when provided true", () => {
      player.setup(true);
      expect(player.isSaboteur).toBe(true);
    });

    it("sets player to gold digger when provided false", () => {
      player.setup(false);
      expect(player.isSaboteur).toBe(false);
    });
  });

  describe("viewFinishCard", () => {
    describe("when viewing general card", () => {
      it("throws exception", () => {
        expect(() => player.viewFinishCard(card as FinishPathCard)).toThrow(
          "Invalid finish card provided"
        );
        expect(player.getViewedFinishCards().length).toBe(0);
      });
    });

    describe("when viewing finish card", () => {
      let finishCard: RockFinishPathCard;

      beforeEach(() => {
        finishCard = new RockFinishPathCard([
          Sides.top,
          Sides.right,
          Sides.bottom,
          Sides.left,
        ]);
      });

      it("adds to the list of viewed cards", () => {
        expect(player.getViewedFinishCards().length).toBe(0);
        player.viewFinishCard(finishCard);
        expect(player.getViewedFinishCards().length).toBe(1);
        expect(player.getViewedFinishCards()[0]).toBe(finishCard);
      });
    });
  });
});
