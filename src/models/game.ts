import eventEmitter, { ListenerFn } from "../event-emitter";
import { generateId, shuffle, Pojo } from "../utils";
import {
  MIN_PLAYERS,
  MAX_PLAYERS,
  NUMBER_OF_ROUNDS,
  roleRatio,
  initialHandSizes,
} from "../constants";
import performPlay from "../perform-play";
import Board from "./board";
import Card from "./cards/card";
import CardParameters from "./cards/card-parameters";
import Deck from "./deck";
import Discard from "./discard";
import Player from "./player";

interface IPlayers {
  [key: string]: Player;
}

interface RoundResult {
  // TODO: implement RoundResult
  todo: boolean;
}

class Game {
  id: string;
  private players: IPlayers;
  private isGameStarted: boolean;
  private deck: Deck;
  private discard: Discard;
  private board: Board;
  private playOrder: string[];
  private discardSequence: Player[];
  private turn: number;
  private roundResults: RoundResult[];

  constructor() {
    this.id = generateId();
    this.players = {};
    this.isGameStarted = false;
    this.deck = new Deck();
    this.discard = new Discard();
    this.board = new Board();
    this.playOrder = [];
    this.discardSequence = [];
    this.turn = 0;
    this.roundResults = [];
  }

  on(name: string, listener: ListenerFn): void {
    eventEmitter.on(name, listener);
  }

  addPlayer(player: Player): void {
    if (Object.keys(this.players).length === MAX_PLAYERS) {
      throw new Error("Maximum number of players");
    }

    this.players[player.id] = player;
    eventEmitter.emit("add-player", player);
  }

  removePlayer(playerId: string): void {
    const removedPlayer = this.players[playerId];
    if (!removedPlayer) return;

    delete this.players[playerId];
    eventEmitter.emit("remove-player", removedPlayer);
  }

  private setupPlayers(): void {
    const { saboteurs, goldDiggers } = roleRatio[this.playOrder.length];
    const allegiances = shuffle(
      ([] as boolean[]).concat(
        new Array(saboteurs).fill(true),
        new Array(goldDiggers).fill(false)
      )
    );
    this.playOrder.forEach((playerId, index) => {
      this.players[playerId].setup(allegiances[index]);
    });

    const initialHandSize = initialHandSizes[this.playOrder.length];
    for (let cardIndex = 0; cardIndex < initialHandSize; cardIndex++) {
      this.playOrder.forEach((playerId) => {
        const card = this.deck.drawCard();
        if (card) this.players[playerId].addToHand(card);
      });
    }
  }

  start(): void {
    const playerIds = Object.keys(this.players);
    if (playerIds.length < MIN_PLAYERS) {
      throw new Error("Not enough players");
    }

    this.playOrder = playerIds.sort(
      (firstId, secondId) =>
        this.players[firstId].age - this.players[secondId].age
    );

    this.setupPlayers();

    this.isGameStarted = true;
    eventEmitter.emit("start-game");
    eventEmitter.emit("start-round", this.roundResults.length);
    eventEmitter.emit("start-turn", this.getActivePlayer());
  }

  private endTurn(isRoundFinished?: boolean): void {
    eventEmitter.emit("end-turn", this.getActivePlayer());
    if (isRoundFinished) return;

    this.turn += 1;
    eventEmitter.emit("start-turn", this.getActivePlayer());
  }

  isStarted(): boolean {
    return this.isGameStarted;
  }

  isFinished(): boolean {
    return this.roundResults.length === NUMBER_OF_ROUNDS;
  }

  getActivePlayer(): Player | undefined {
    if (!this.isGameStarted || this.isFinished()) {
      return undefined;
    }

    const playerIndex = this.turn % this.playOrder.length;
    const activePlayerId = this.playOrder[playerIndex];
    return this.players[activePlayerId];
  }

  getPlayers(): Player[] {
    return Object.keys(this.players).map((id) => this.players[id]);
  }

  getPlayer(playerId: string): Player | undefined {
    return this.players[playerId];
  }

  private finishRound(): void {
    this.endTurn(true);

    // TODO: Generate round results
    const roundResults = { todo: true };
    eventEmitter.emit("end-round", this.roundResults.length, roundResults);
    this.roundResults.push(roundResults);

    if (this.isFinished()) {
      eventEmitter.emit("end-game");
      // TODO: Emit player scores, winners, etc.
    } else {
      this.deck = new Deck();
      this.discard = new Discard();
      this.board = new Board();
      this.setupPlayers();
    }
  }

  playCard(player: Player, cardId: string, parameters: CardParameters): void {
    if (!this.isGameStarted) {
      throw new Error("Game has not started");
    }

    this.discardSequence = [];
    const playedCard = player.playCard(cardId, parameters);
    const affectedCards = performPlay(playedCard, player, this.board);

    eventEmitter.emit("play-card", player, playedCard);
    player.removeFromHand(cardId);

    affectedCards.forEach((affectedCard: Card) => {
      this.discard.addPlayed(affectedCard);
    });

    const drawnCard = this.deck.drawCard();
    if (drawnCard) player.addToHand(drawnCard);

    if (this.board.isComplete) {
      this.finishRound();
      return;
    }

    this.endTurn();
  }

  discardCard(player: Player, cardId?: string): void {
    if (!this.isGameStarted) {
      throw new Error("Game has not started");
    }

    if (player.getHandCardCount() === 0) {
      eventEmitter.emit("discard-card", player, null);
    } else {
      if (!cardId) throw new Error("Player must discard");

      const card = player.discardCard(cardId);
      this.discard.addDiscarded(card);
      eventEmitter.emit("discard-card", player, card);
    }

    const drawnCard = this.deck.drawCard();
    if (drawnCard) player.addToHand(drawnCard);

    if (this.deck.getCardCount() === 0) {
      this.discardSequence.push(player);
      if (this.discardSequence.length === this.playOrder.length) {
        this.finishRound();
        return;
      }
    }

    this.endTurn();
  }

  getTopOfDiscardPile(): Card | null | undefined {
    return this.discard.getTopCard();
  }

  visualizeBoard(): string {
    return this.board.visualize();
  }

  toJS(): Pojo {
    return {
      id: this.id,
      players: this.players,
      isStarted: this.isStarted(),
      isFinished: this.isFinished(),
      deck: this.deck,
      discard: this.discard,
      board: this.board,
      playOrder: this.playOrder,
      turn: this.turn,
      roundResults: this.roundResults,
    };
  }
}

export default Game;
