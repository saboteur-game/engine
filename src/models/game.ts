import eventEmitter, { ListenerFn } from "../event-emitter";
import { generateId, shuffle, Pojo } from "../utils";
import {
  MIN_PLAYERS,
  MAX_PLAYERS,
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

class Game {
  id: string;
  private players: IPlayers;
  private isStarted: boolean;
  private isFinished: boolean;
  private deck: Deck;
  private discard: Discard;
  private board: Board;
  private playOrder: string[];
  private turn: number;

  constructor() {
    this.id = generateId();
    this.players = {};
    this.isStarted = false;
    this.isFinished = false;
    this.deck = new Deck();
    this.discard = new Discard();
    this.board = new Board();
    this.playOrder = [];
    this.turn = 0;
    // TODO: this.round = 0;
  }

  on(name: string, listener: ListenerFn): void {
    eventEmitter.on(name, listener);
  }

  addPlayer(player: Player): void {
    const playerIds = Object.keys(this.players);
    if (playerIds.length === MAX_PLAYERS) {
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

  start(): void {
    const playerIds = Object.keys(this.players);
    if (playerIds.length < MIN_PLAYERS) {
      throw new Error("Not enough players");
    }

    this.playOrder = playerIds.sort(
      (firstId, secondId) =>
        this.players[firstId].age - this.players[secondId].age
    );

    const { saboteurs, goldDiggers } = roleRatio[playerIds.length];
    const allegiances = shuffle(
      ([] as boolean[]).concat(
        new Array(saboteurs).fill(true),
        new Array(goldDiggers).fill(false)
      )
    );
    this.playOrder.forEach((playerId, index) => {
      this.players[playerId].setAllegiance(allegiances[index]);
    });

    const initialHandSize = initialHandSizes[playerIds.length];
    for (let cardIndex = 0; cardIndex < initialHandSize; cardIndex++) {
      for (let playerIndex = 0; playerIndex < playerIds.length; playerIndex++) {
        const playerId = playerIds[playerIndex];
        const card = this.deck.drawCard();
        if (card) this.players[playerId].addToHand(card);
      }
    }

    this.isStarted = true;
    eventEmitter.emit("start-game");
    eventEmitter.emit("start-turn", this.getActivePlayer());
  }

  private endTurn(): void {
    eventEmitter.emit("end-turn", this.getActivePlayer());
    this.turn += 1;
    eventEmitter.emit("start-turn", this.getActivePlayer());
  }

  getActivePlayer(): Player | undefined {
    if (!this.isStarted) return undefined;

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

  playCard(player: Player, cardId: string, parameters: CardParameters): void {
    if (!this.isStarted) {
      throw new Error("Game has not started");
    }

    const playedCard = player.playCard(cardId, parameters);
    const affectedCards = performPlay(playedCard, player, this.board);

    eventEmitter.emit("play-card", player, playedCard);
    player.removeFromHand(cardId);

    affectedCards.forEach((affectedCard: Card) => {
      this.discard.addPlayed(affectedCard);
    });

    const drawnCard = this.deck.drawCard();
    if (drawnCard) player.addToHand(drawnCard);

    this.endTurn();
  }

  discardCard(player: Player, cardId?: string): void {
    if (!this.isStarted) {
      throw new Error("Game has not started");
    }

    if (player.getHandCardCount() === 0) {
      eventEmitter.emit("discard-card", player, null);
      this.endTurn();
      return;
    }

    if (!cardId) {
      throw new Error("Player must discard");
    }

    const card = player.discardCard(cardId);
    this.discard.addDiscarded(card);
    eventEmitter.emit("discard-card", player, card);
    const drawnCard = this.deck.drawCard();
    if (drawnCard) player.addToHand(drawnCard);

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
      isStarted: this.isStarted,
      isFinished: this.isFinished,
      deck: this.deck,
      discard: this.discard,
      board: this.board,
      playOrder: this.playOrder,
      turn: this.turn,
    };
  }
}

export default Game;
