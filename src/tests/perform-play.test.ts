import {
  ActionCard,
  RepairActionCard,
  BreakActionCard,
  RockfallActionCard,
  MapActionCard,
} from "../models/cards/action-cards";
import Player from "../models/player";
import Board, { middleFinishPosition } from "../models/board";
import { Tools } from "../constants";
import { PassageCard, DeadendCard } from "../models/cards/path-cards";
import Position from "../models/position";
import performPlay from "../perform-play";

const PLAY_POSITION = new Position(0, 1);

describe("performPlay", () => {
  let activePlayer: Player;
  let targetPlayer: Player;
  let board: Board;

  beforeEach(() => {
    activePlayer = new Player("Alice", 35);
    targetPlayer = new Player("Bob", 30);
    board = new Board();
  });

  describe("when missing card parameters", () => {
    it("throws exception", () => {
      const actionCard = new ActionCard();
      expect(() => performPlay(actionCard, activePlayer, board)).toThrow(
        "Missing action parameters"
      );
    });
  });

  describe("when PassageCard is played", () => {
    let tunnelCard: PassageCard;

    beforeEach(() => {
      tunnelCard = new PassageCard([1, 2, 3, 4]);
    });

    it("adds the card to the board", () => {
      expect(board.getCardAt(PLAY_POSITION)).toBe(undefined);

      tunnelCard.play({ position: PLAY_POSITION });
      performPlay(tunnelCard, activePlayer, board);

      expect(board.getCardAt(PLAY_POSITION)).toBe(tunnelCard);
    });
  });

  describe("when DeadendCard is played", () => {
    let tunnelCard: PassageCard;

    beforeEach(() => {
      tunnelCard = new DeadendCard([1, 2, 3, 4]);
    });

    it("adds the card to the board", () => {
      expect(board.getCardAt(PLAY_POSITION)).toBe(undefined);

      tunnelCard.play({ position: PLAY_POSITION });
      performPlay(tunnelCard, activePlayer, board);

      expect(board.getCardAt(PLAY_POSITION)).toBe(tunnelCard);
    });
  });

  describe("when RepairActionCard is played", () => {
    let actionCard: RepairActionCard;

    beforeEach(() => {
      targetPlayer.breakTool(Tools.pick);
      actionCard = new RepairActionCard(Tools.pick);
    });

    it("repairs the players tool", () => {
      expect(targetPlayer.getTools()).toEqual({
        pick: false,
        lamp: true,
        wagon: true,
      });

      actionCard.play({ player: targetPlayer, appliedTo: Tools.pick });
      performPlay(actionCard, activePlayer, board);

      expect(targetPlayer.getTools()).toEqual({
        pick: true,
        lamp: true,
        wagon: true,
      });
    });
  });

  describe("when BreakActionCard is played", () => {
    let actionCard: BreakActionCard;

    beforeEach(() => {
      actionCard = new BreakActionCard(Tools.pick);
    });

    it("breaks the players tool", () => {
      expect(targetPlayer.getTools()).toEqual({
        pick: true,
        lamp: true,
        wagon: true,
      });

      actionCard.play({ player: targetPlayer, appliedTo: Tools.pick });
      performPlay(actionCard, activePlayer, board);

      expect(targetPlayer.getTools()).toEqual({
        pick: false,
        lamp: true,
        wagon: true,
      });
    });
  });

  describe("when RockfallActionCard is played", () => {
    let actionCard: RockfallActionCard;
    let passageCard: PassageCard;

    beforeEach(() => {
      actionCard = new RockfallActionCard();
      passageCard = new PassageCard([1, 2, 3, 4]);
      board.addCard(passageCard, PLAY_POSITION);
    });

    it("removes the card from the board", () => {
      expect(board.getCardAt(PLAY_POSITION)).toBe(passageCard);

      actionCard.play({ position: PLAY_POSITION });
      performPlay(actionCard, activePlayer, board);

      expect(board.getCardAt(PLAY_POSITION)).toBe(undefined);
    });
  });

  describe("when MapActionCard is played", () => {
    let actionCard: MapActionCard;

    beforeEach(() => {
      actionCard = new MapActionCard();
    });

    it("shows the card to the player", () => {
      expect(activePlayer.getViewedFinishCards()).toHaveLength(0);

      actionCard.play({ position: middleFinishPosition });
      performPlay(actionCard, activePlayer, board);

      expect(activePlayer.getViewedFinishCards()).toHaveLength(1);
    });
  });

  describe("when unknown card is played", () => {
    let actionCard: ActionCard;

    beforeEach(() => {
      actionCard = new ActionCard();
    });

    it("throws exception", () => {
      actionCard.play({ position: middleFinishPosition });
      expect(() => performPlay(actionCard, activePlayer, board)).toThrow(
        "Unknown card"
      );
    });
  });
});
