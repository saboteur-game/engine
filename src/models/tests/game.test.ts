import { mocked } from "ts-jest/utils";
import eventEmitter from "../../event-emitter";
import Player from "../player";
import { PathCard, PassageCard } from "../cards/path-cards";
import { MapActionCard, ActionCard } from "../cards/action-cards";
import CardParameters from "../cards/card-parameters";
import { getShuffledDeck } from "../cards";
import { middleFinishPosition } from "../board";
import Game from "../game";
import { Sides } from "../cards/card";
import Position from "../position";

jest.mock("../../event-emitter");
jest.mock("../cards", () => {
  jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  const cards = jest.requireActual("../cards");
  return {
    ...cards,
    getShuffledDeck: jest.fn().mockReturnValue(cards.getShuffledDeck()),
  };
});

const mockedGetSuffledDeck = mocked(getShuffledDeck);

describe("Game", () => {
  let game: Game;

  const rounds = [0, 1, 2];

  const playCardForPlayer = (
    sides: Sides[],
    position: Position
  ): PassageCard => {
    const player = game.getActivePlayer() as Player;
    const card = new PassageCard(sides);
    player.addToHand(card);
    game.playCard(player, card.id, { position });
    return card;
  };

  const completeRound = (shouldComplete = true) => {
    const horizontalCards = [0, 1, 2, 3, 4, 5];
    horizontalCards.forEach((value, index) => {
      playCardForPlayer([Sides.right, Sides.left], new Position(index + 1, 0));
    });
    playCardForPlayer([Sides.top, Sides.left], new Position(7, 0));
    playCardForPlayer([Sides.bottom, Sides.right], new Position(7, 1));
    if (shouldComplete) {
      playCardForPlayer([Sides.top, Sides.left], new Position(8, 1));
    }
  };

  const addPlayersToGame = (count: number): Player[] => {
    const players = Array(count)
      .fill(undefined)
      .map((value, index) => new Player(`Player ${index + 1}`, 20 + index));
    players.forEach((player) => game.addPlayer(player));
    return players;
  };

  const runForEmitterTest = (wrappedAction: () => void) => {
    jest.clearAllMocks();
    try {
      wrappedAction();
    } catch (e) {
      // noop
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    game = new Game();
  });

  it("can be serialized", () => {
    expect(game.toJSON()).toMatchSnapshot();
  });

  it("can visualize the board", () => {
    expect(game.visualizeBoard()).toMatchSnapshot();
  });

  describe("on event", () => {
    const mockEventHandler = jest.fn();

    beforeEach(() => {
      game.on("*", mockEventHandler);
    });

    it("sets up event listener", () => {
      expect(eventEmitter.on).toHaveBeenCalledTimes(1);
      expect(eventEmitter.on).toHaveBeenCalledWith("*", mockEventHandler);
    });
  });

  describe("addPlayer", () => {
    let player: Player;

    beforeEach(() => {
      player = new Player("Alice", 35);
    });

    describe("when maximum number of players have been added", () => {
      beforeEach(() => {
        addPlayersToGame(10);
        jest.clearAllMocks();
      });

      it("throws exception", () => {
        expect(() => game.addPlayer(player)).toThrow(
          "Maximum number of players"
        );
        expect(game.getPlayers().length).toBe(10);
      });

      it("does not emit event", () => {
        runForEmitterTest(() => game.addPlayer(player));
        expect(eventEmitter.emit).not.toHaveBeenCalled();
      });
    });

    describe("when no players have been added", () => {
      beforeEach(() => {
        game.addPlayer(player);
      });

      it("adds the player", () => {
        expect(game.getPlayers()).toMatchSnapshot();
      });

      it("emits add-player event", () => {
        expect(eventEmitter.emit).toHaveBeenCalledTimes(1);
        expect(eventEmitter.emit).toHaveBeenCalledWith("add-player", player);
      });
    });
  });

  describe("removePlayer", () => {
    let player: Player;

    beforeEach(() => {
      player = new Player("Alice", 35);
    });

    describe("when there are no players added", () => {
      it("does nothing", () => {
        expect(game.getPlayers().length).toBe(0);
        game.removePlayer(player.id);
        expect(game.getPlayers().length).toBe(0);
      });

      it("does not emit event", () => {
        jest.clearAllMocks();
        game.removePlayer(player.id);
        expect(eventEmitter.emit).not.toHaveBeenCalled();
      });
    });

    describe("when players have been added", () => {
      beforeEach(() => {
        game.addPlayer(player);
        jest.clearAllMocks();
      });

      it("removes the player", () => {
        expect(game.getPlayers().length).toBe(1);
        game.removePlayer(player.id);
        expect(game.getPlayers().length).toBe(0);
      });

      it("emits remove-player event", () => {
        game.removePlayer(player.id);
        expect(eventEmitter.emit).toHaveBeenCalledTimes(1);
        expect(eventEmitter.emit).toHaveBeenCalledWith("remove-player", player);
      });
    });
  });

  describe("start", () => {
    describe("without enough players", () => {
      beforeEach(() => {
        addPlayersToGame(2);
      });

      it("throws exception", () => {
        expect(() => game.start()).toThrow("Not enough players");
      });

      it("does not emit event", () => {
        runForEmitterTest(() => game.start());
        expect(eventEmitter.emit).not.toHaveBeenCalled();
      });
    });

    describe("with enough players", () => {
      let players: Player[];

      beforeEach(() => {
        players = addPlayersToGame(3);
      });

      it("sets player allegiances and deals cards", () => {
        game.start();
        expect(game.getPlayers()).toMatchSnapshot();
      });

      it("emits start-game and start-turn events", () => {
        jest.clearAllMocks();
        game.start();
        expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
        expect(eventEmitter.emit).toHaveBeenCalledWith("start-game");
        expect(eventEmitter.emit).toHaveBeenCalledWith("start-round", 0);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "start-turn",
          players[0]
        );
      });
    });
  });

  describe("getActivePlayer", () => {
    let players: Player[];

    beforeEach(() => {
      players = addPlayersToGame(3);
    });

    describe("when game is not started", () => {
      it("returns undefined", () => {
        expect(game.getActivePlayer()).toBe(undefined);
      });
    });

    describe("when game is started", () => {
      beforeEach(() => {
        game.start();
      });

      it("returns active player", () => {
        expect(game.getActivePlayer()).toBe(players[0]);
      });
    });

    describe("when game is ended", () => {
      beforeEach(() => {
        game.start();
        rounds.forEach(() => completeRound());
      });

      it("returns undefined", () => {
        expect(game.getActivePlayer()).toBe(undefined);
      });
    });
  });

  describe("getPlayer", () => {
    let player: Player;

    beforeEach(() => {
      player = new Player("Alice", 35);
    });

    describe("when there are no players added", () => {
      it("returns undefined", () => {
        expect(game.getPlayer(player.id)).toBe(undefined);
      });
    });

    describe("when players have been added", () => {
      beforeEach(() => {
        game.addPlayer(player);
      });

      it("get the player", () => {
        expect(game.getPlayer(player.id)).toBe(player);
      });
    });
  });

  describe("playCard", () => {
    let players: Player[];
    let card: MapActionCard;
    let parameters: CardParameters;

    beforeEach(() => {
      players = addPlayersToGame(3);
      card = new MapActionCard();
      parameters = { position: middleFinishPosition };
    });

    describe("when game is not started", () => {
      it("throws exception", () => {
        expect(() => game.playCard(players[0], card.id, parameters)).toThrow(
          "Game has not started"
        );
      });

      it("does not emit event", () => {
        runForEmitterTest(() => game.playCard(players[0], card.id, parameters));
        expect(eventEmitter.emit).not.toHaveBeenCalled();
      });
    });

    describe("when game is started", () => {
      beforeEach(() => {
        game.start();
      });

      describe("card is not in the players hand", () => {
        it("throws exception", () => {
          expect(() => game.playCard(players[0], card.id, parameters)).toThrow(
            "Cannot play card which isn't in players hand"
          );
        });

        it("does not emit event", () => {
          runForEmitterTest(() =>
            game.playCard(players[0], card.id, parameters)
          );
          expect(eventEmitter.emit).not.toHaveBeenCalled();
        });
      });

      describe("card is in the players hand", () => {
        beforeEach(() => {
          players[0].addToHand(card);
          jest.clearAllMocks();
          game.playCard(players[0], card.id, parameters);
        });

        it("adds a new card to the players hand", () => {
          expect(players[0].getHand().includes(card)).toBe(false);
          expect(players[0].getHand()).toMatchSnapshot();
        });

        it("adds the card to the discard pile", () => {
          expect(game.getTopOfDiscardPile()).toMatchSnapshot();
        });

        it("ends the players turn and starts the next players turn", () => {
          expect(game.getActivePlayer()).toBe(players[1]);
        });

        it("emits play-card, end-turn and start-turn events", () => {
          expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "play-card",
            players[0],
            card
          );
          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "end-turn",
            players[0]
          );
          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "start-turn",
            players[1]
          );
        });
      });

      describe("card finishes the round", () => {
        beforeEach(() => {
          game.start();
          completeRound(false);
          jest.clearAllMocks();
        });

        it("ends the players turn and starts the round with the next players turn", () => {
          playCardForPlayer([Sides.top, Sides.left], new Position(8, 1));
          expect(game.getActivePlayer()).toBe(players[2]);
        });

        it("emits play-card, end-turn and end-round events", () => {
          const player = game.getActivePlayer();
          const card = playCardForPlayer(
            [Sides.top, Sides.left],
            new Position(8, 1)
          );
          expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "play-card",
            player,
            card
          );
          expect(eventEmitter.emit).toHaveBeenCalledWith("end-turn", player);
          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "end-round",
            0,
            expect.anything()
          );
          const mockEmit = mocked(eventEmitter.emit);
          expect(mockEmit.mock.calls[2][2]).toMatchSnapshot();
        });
      });

      describe("card finishes the game", () => {
        beforeEach(() => {
          game.start();
          rounds.forEach((index) => completeRound(index !== 2));
          jest.clearAllMocks();
        });

        it("ends the players turn and does not start the next players turn", () => {
          playCardForPlayer([Sides.top, Sides.left], new Position(8, 1));
          expect(game.getActivePlayer()).toBe(undefined);
        });

        it("emits play-card, end-turn, end-round and end-game events", () => {
          const mockEmit = mocked(eventEmitter.emit);
          const player = game.getActivePlayer();
          const card = playCardForPlayer(
            [Sides.top, Sides.left],
            new Position(8, 1)
          );
          expect(eventEmitter.emit).toHaveBeenCalledTimes(4);
          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "play-card",
            player,
            card
          );
          expect(eventEmitter.emit).toHaveBeenCalledWith("end-turn", player);
          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "end-round",
            2,
            expect.anything()
          );
          expect(mockEmit.mock.calls[2][2]).toMatchSnapshot();
          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "end-game",
            expect.anything()
          );
          expect(mockEmit.mock.calls[3][1]).toMatchSnapshot();
        });
      });
    });
  });

  describe("discardCard", () => {
    let players: Player[];
    let card: MapActionCard;

    beforeEach(() => {
      players = addPlayersToGame(3);
      card = new MapActionCard();
    });

    describe("when game is not started", () => {
      it("throws exception", () => {
        expect(() => game.discardCard(players[0], card.id)).toThrow(
          "Game has not started"
        );
      });

      it("does not emit event", () => {
        runForEmitterTest(() => game.discardCard(players[0], card.id));
        expect(eventEmitter.emit).not.toHaveBeenCalled();
      });
    });

    describe("when game is started", () => {
      beforeEach(() => {
        game.start();
      });

      describe("card is not in the players hand", () => {
        it("throws exception", () => {
          expect(() => game.discardCard(players[0], card.id)).toThrow(
            "Cannot discard card which isn't in players hand"
          );
        });

        it("does not emit event", () => {
          runForEmitterTest(() => game.discardCard(players[0], card.id));
          expect(eventEmitter.emit).not.toHaveBeenCalled();
        });
      });

      describe("no card is supplied", () => {
        describe("when the player has cards in their hand", () => {
          beforeEach(() => {
            players[0].addToHand(card);
            jest.clearAllMocks();
          });

          it("throws exception", () => {
            expect(() => game.discardCard(players[0])).toThrow(
              "Player must discard"
            );
          });

          it("does not emit event", () => {
            runForEmitterTest(() => game.discardCard(players[0]));
            expect(eventEmitter.emit).not.toHaveBeenCalled();
          });
        });

        describe("when the player has no cards in their hand", () => {
          beforeEach(() => {
            players[0]
              .getHand()
              .forEach((card: ActionCard | PathCard) =>
                players[0].removeFromHand(card.id)
              );
            jest.clearAllMocks();
            game.discardCard(players[0]);
          });

          it("adds the card to the discard pile", () => {
            expect(game.getTopOfDiscardPile()).toBe(undefined);
          });

          it("add cards to the players hand from the deck", () => {
            expect(players[0].getHandCardCount()).toBe(1);
          });

          it("ends the players turn and starts the next players turn", () => {
            expect(game.getActivePlayer()).toBe(players[1]);
          });

          it("emits discard-card, end-turn and start-turn events", () => {
            expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
            expect(eventEmitter.emit).toHaveBeenCalledWith(
              "discard-card",
              players[0],
              null
            );
            expect(eventEmitter.emit).toHaveBeenCalledWith(
              "end-turn",
              players[0]
            );
            expect(eventEmitter.emit).toHaveBeenCalledWith(
              "start-turn",
              players[1]
            );
          });
        });
      });

      describe("card is in the players hand", () => {
        beforeEach(() => {
          players[0].addToHand(card);
          jest.clearAllMocks();
          game.discardCard(players[0], card.id);
        });

        it("adds a new card to the players hand", () => {
          expect(players[0].getHand().includes(card)).toBe(false);
          expect(players[0].getHand()).toMatchSnapshot();
        });

        it("adds the card to the discard pile", () => {
          expect(game.getTopOfDiscardPile()).toBe(null);
        });

        it("ends the players turn and starts the next players turn", () => {
          expect(game.getActivePlayer()).toBe(players[1]);
        });

        it("emits discard-card, end-turn and start-turn events", () => {
          expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "discard-card",
            players[0],
            card
          );
          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "end-turn",
            players[0]
          );
          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "start-turn",
            players[1]
          );
        });
      });

      describe("when all players discard a card", () => {
        beforeEach(() => {
          players.slice(0, -1).forEach((player) => {
            const card = player.getHand()[0];
            game.discardCard(player, card.id);
          });
          jest.clearAllMocks();
        });

        it("emits end-turn but does not end the round", () => {
          const player = game.getActivePlayer() as Player;
          const card = player.getHand()[0];
          game.discardCard(player, card.id);

          expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "discard-card",
            player,
            card
          );
          expect(eventEmitter.emit).toHaveBeenCalledWith("end-turn", player);
          expect(eventEmitter.emit).toHaveBeenCalledWith(
            "start-turn",
            game.getActivePlayer()
          );
        });
      });
    });
  });

  describe("when the deck is reduced in size", () => {
    let players: Player[];

    beforeEach(() => {
      jest.clearAllMocks();
      mockedGetSuffledDeck.mockImplementation(() => [
        new MapActionCard(),
        new MapActionCard(),
        new MapActionCard(),
      ]);
      game = new Game();
      players = addPlayersToGame(3);
      game.start();
    });

    it("deals available cards to players", () => {
      expect(players[0].getHand().length).toBe(1);
      expect(players[1].getHand().length).toBe(1);
      expect(players[2].getHand().length).toBe(1);
    });

    describe("playCard", () => {
      beforeEach(() => {
        const card = players[0].getHand()[0];
        const parameters = { position: middleFinishPosition };
        game.playCard(players[0], card.id, parameters);
      });

      it("does not add a new card to the players hand", () => {
        expect(players[0].getHand().length).toBe(0);
      });
    });

    describe("discardCard", () => {
      beforeEach(() => {
        const card = players[0].getHand()[0];
        game.discardCard(players[0], card.id);
      });

      it("does not add a new card to the players hand", () => {
        expect(players[0].getHand().length).toBe(0);
      });
    });
  });

  describe("when the deck is empty and players have multiple cards in their hand", () => {
    let players: Player[];

    beforeEach(() => {
      jest.clearAllMocks();
      mockedGetSuffledDeck.mockImplementation(() => [
        new MapActionCard(),
        new MapActionCard(),
        new MapActionCard(),
        new MapActionCard(),
        new MapActionCard(),
        new MapActionCard(),
      ]);
      game = new Game();
      players = addPlayersToGame(3);
      game.start();
    });

    describe("when all players play or discard a card", () => {
      beforeEach(() => {
        players.slice(0, -1).forEach((player, index) => {
          const card = player.getHand()[0];
          if (index % 2) {
            game.discardCard(player, card.id);
          } else {
            game.playCard(player, card.id, { position: middleFinishPosition });
          }
        });
        jest.clearAllMocks();
      });

      it("emits end-turn but does not end the round", () => {
        const player = game.getActivePlayer() as Player;
        const card = player.getHand()[0];
        game.discardCard(player, card.id);

        expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "discard-card",
          player,
          card
        );
        expect(eventEmitter.emit).toHaveBeenCalledWith("end-turn", player);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "start-turn",
          game.getActivePlayer()
        );
      });
    });

    describe("when all players play a card", () => {
      beforeEach(() => {
        players.slice(0, -1).forEach((player) => {
          const card = player.getHand()[0];
          game.playCard(player, card.id, { position: middleFinishPosition });
        });
        jest.clearAllMocks();
      });

      it("emits end-turn but does not end the round", () => {
        const player = game.getActivePlayer() as Player;
        const card = player.getHand()[0];
        game.playCard(player, card.id, { position: middleFinishPosition });

        expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "play-card",
          player,
          card
        );
        expect(eventEmitter.emit).toHaveBeenCalledWith("end-turn", player);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "start-turn",
          game.getActivePlayer()
        );
      });
    });

    describe("when all players discard a card", () => {
      beforeEach(() => {
        players.slice(0, -1).forEach((player) => {
          const card = player.getHand()[0];
          game.discardCard(player, card.id);
        });
        jest.clearAllMocks();
      });

      it("emits end-turn and ends the round", () => {
        const player = game.getActivePlayer() as Player;
        const card = player.getHand()[0];
        game.discardCard(player, card.id);

        expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "discard-card",
          player,
          card
        );
        expect(eventEmitter.emit).toHaveBeenCalledWith("end-turn", player);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "end-round",
          0,
          expect.anything()
        );
        const mockEmit = mocked(eventEmitter.emit);
        expect(mockEmit.mock.calls[2][2]).toMatchSnapshot();
      });
    });
  });

  describe("when the deck is empty and players have one card in their hand", () => {
    let players: Player[];

    beforeEach(() => {
      jest.clearAllMocks();
      mockedGetSuffledDeck.mockImplementation(() => [
        new MapActionCard(),
        new MapActionCard(),
        new MapActionCard(),
      ]);
      game = new Game();
      players = addPlayersToGame(3);
      game.start();
    });

    describe("when all players play or discard a card", () => {
      beforeEach(() => {
        players.slice(0, -1).forEach((player, index) => {
          const card = player.getHand()[0];
          if (index % 2) {
            game.discardCard(player, card.id);
          } else {
            game.playCard(player, card.id, { position: middleFinishPosition });
          }
        });
        jest.clearAllMocks();
      });

      it("emits end-turn and ends the round", () => {
        const player = game.getActivePlayer() as Player;
        const card = player.getHand()[0];
        game.discardCard(player, card.id);

        expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "discard-card",
          player,
          card
        );
        expect(eventEmitter.emit).toHaveBeenCalledWith("end-turn", player);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "end-round",
          0,
          expect.anything()
        );
        const mockEmit = mocked(eventEmitter.emit);
        expect(mockEmit.mock.calls[2][2]).toMatchSnapshot();
      });
    });

    describe("when all players play a card", () => {
      beforeEach(() => {
        players.slice(0, -1).forEach((player) => {
          const card = player.getHand()[0];
          game.playCard(player, card.id, { position: middleFinishPosition });
        });
        jest.clearAllMocks();
      });

      it("emits end-turn and ends the round", () => {
        const player = game.getActivePlayer() as Player;
        const card = player.getHand()[0];
        game.playCard(player, card.id, { position: middleFinishPosition });

        expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "play-card",
          player,
          card
        );
        expect(eventEmitter.emit).toHaveBeenCalledWith("end-turn", player);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "end-round",
          0,
          expect.anything()
        );
        const mockEmit = mocked(eventEmitter.emit);
        expect(mockEmit.mock.calls[2][2]).toMatchSnapshot();
      });
    });

    describe("when all players discard a card", () => {
      beforeEach(() => {
        players.slice(0, -1).forEach((player) => {
          const card = player.getHand()[0];
          game.discardCard(player, card.id);
        });
        jest.clearAllMocks();
      });

      it("emits end-turn and ends the round", () => {
        const player = game.getActivePlayer() as Player;
        const card = player.getHand()[0];
        game.discardCard(player, card.id);

        expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "discard-card",
          player,
          card
        );
        expect(eventEmitter.emit).toHaveBeenCalledWith("end-turn", player);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          "end-round",
          0,
          expect.anything()
        );
        const mockEmit = mocked(eventEmitter.emit);
        expect(mockEmit.mock.calls[2][2]).toMatchSnapshot();
      });
    });
  });
});
