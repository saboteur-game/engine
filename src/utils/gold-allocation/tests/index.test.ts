import RewardDeck from "../../../models/reward-deck";
import Player from "../../../models/player";
import {
  IPlayers,
  allocateGoldToGoldDiggers,
  allocateGoldToSaboteurs,
} from "../";

describe("Gold allocation", () => {
  let rewardDeck: RewardDeck;
  let playOrder: string[];
  let players: IPlayers;
  let lastPlayer: Player;

  const generatePlayers = (count: number, saboteurs: number): void => {
    const gamePlayers = Array(count)
      .fill(undefined)
      .map((value, index) => new Player(`Player ${index + 1}`, 20 + index));

    for (let i = 1; i <= saboteurs; i++) {
      gamePlayers[i * 2].setup(true);
    }

    players = gamePlayers.reduce(
      (mapping, player) => ({
        ...mapping,
        [player.id]: player,
      }),
      {}
    );
    playOrder = gamePlayers.map(({ id }) => id);
  };

  beforeEach(() => {
    rewardDeck = new RewardDeck();
  });

  describe("allocateGoldToGoldDiggers", () => {
    describe("when the saboteur is the active player", () => {
      beforeEach(() => {
        generatePlayers(6, 2);
        lastPlayer = players[playOrder[2]];
      });

      it("allocates gold to the gold diggers", () => {
        const allocatedGold = allocateGoldToGoldDiggers(
          rewardDeck,
          playOrder,
          players,
          lastPlayer
        );
        expect(allocatedGold[lastPlayer.id]).toBe(undefined);
        expect(allocatedGold).toMatchSnapshot();
      });
    });

    describe("when the reward deck is empty", () => {
      beforeEach(() => {
        const totalCards = rewardDeck.getCardCount();
        for (let i = 0; i < totalCards; i++) rewardDeck.drawCard();
        generatePlayers(4, 0);
        lastPlayer = players[playOrder[0]];
      });

      it("does not allocate any gold", () => {
        expect(
          allocateGoldToGoldDiggers(rewardDeck, playOrder, players, lastPlayer)
        ).toStrictEqual({});
      });
    });

    describe("when there are no saboteurs", () => {
      beforeEach(() => {
        generatePlayers(4, 0);
        lastPlayer = players[playOrder[0]];
      });

      it("allocates gold to the gold diggers", () => {
        expect(
          allocateGoldToGoldDiggers(rewardDeck, playOrder, players, lastPlayer)
        ).toMatchSnapshot();
      });
    });

    describe("when there is 1 saboteur", () => {
      beforeEach(() => {
        generatePlayers(5, 1);
      });

      it("allocates gold to the gold diggers", () => {
        expect(
          allocateGoldToGoldDiggers(rewardDeck, playOrder, players, lastPlayer)
        ).toMatchSnapshot();
      });
    });

    describe("when there are 2 saboteurs", () => {
      beforeEach(() => {
        generatePlayers(6, 2);
      });

      it("allocates gold to the gold diggers", () => {
        expect(
          allocateGoldToGoldDiggers(rewardDeck, playOrder, players, lastPlayer)
        ).toMatchSnapshot();
      });
    });

    describe("when there are 3 saboteurs", () => {
      beforeEach(() => {
        generatePlayers(7, 3);
      });

      it("allocates gold to the gold diggers", () => {
        expect(
          allocateGoldToGoldDiggers(rewardDeck, playOrder, players, lastPlayer)
        ).toMatchSnapshot();
      });
    });

    describe("when there are 4 saboteurs", () => {
      beforeEach(() => {
        generatePlayers(10, 4);
      });

      it("allocates gold to the gold diggers", () => {
        expect(
          allocateGoldToGoldDiggers(rewardDeck, playOrder, players, lastPlayer)
        ).toMatchSnapshot();
      });
    });
  });

  describe("allocateGoldToSaboteurs", () => {
    describe("when there are no saboteurs", () => {
      beforeEach(() => {
        generatePlayers(4, 0);
      });

      it("allocates no gold", () => {
        expect(
          allocateGoldToSaboteurs(rewardDeck, playOrder, players)
        ).toStrictEqual({});
      });
    });

    describe("when there is 1 saboteur", () => {
      beforeEach(() => {
        generatePlayers(5, 1);
      });

      it("allocates gold to the saboteurs", () => {
        expect(
          allocateGoldToSaboteurs(rewardDeck, playOrder, players)
        ).toMatchSnapshot();
      });
    });

    describe("when there are 2 saboteurs", () => {
      beforeEach(() => {
        generatePlayers(6, 2);
      });

      it("allocates gold to the saboteurs", () => {
        expect(
          allocateGoldToSaboteurs(rewardDeck, playOrder, players)
        ).toMatchSnapshot();
      });
    });

    describe("when there are 3 saboteurs", () => {
      beforeEach(() => {
        generatePlayers(7, 3);
      });

      it("allocates gold to the saboteurs", () => {
        expect(
          allocateGoldToSaboteurs(rewardDeck, playOrder, players)
        ).toMatchSnapshot();
      });
    });

    describe("when there are 4 saboteurs", () => {
      beforeEach(() => {
        generatePlayers(10, 4);
      });

      it("allocates gold to the saboteurs", () => {
        expect(
          allocateGoldToSaboteurs(rewardDeck, playOrder, players)
        ).toMatchSnapshot();
      });
    });
  });
});
