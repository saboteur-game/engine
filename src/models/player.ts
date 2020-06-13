import { generateId, Pojo } from "../utils";
import { Tools } from "../constants";
import Card from "./cards/card";
import { FinishPathCard, PathCard } from "./cards/path-cards";
import CardParameters from "./cards/card-parameters";
import { ActionCard } from "./cards/action-cards";

const randomAge = () => Math.floor(Math.random() * 82) + 8; // between 8 and 90

class Player {
  id: string;
  name: string;
  age: number;
  private hand!: { [key: string]: ActionCard | PathCard };
  private viewedFinishCards!: { [key: string]: FinishPathCard };
  isSaboteur!: boolean;
  private tools!: { [key in Tools]: boolean };

  constructor(name: string, age?: number) {
    this.id = generateId();
    this.name = name;
    this.age = age || randomAge();
    this.setup(false);
  }

  addToHand(card: ActionCard | PathCard): void {
    this.hand[card.id] = card;
  }

  removeFromHand(cardId: string): void {
    if (!this.hand[cardId]) {
      throw new Error("Cannot remove card which isn't in players hand");
    }
    delete this.hand[cardId];
  }

  getHand(): (ActionCard | PathCard)[] {
    return Object.keys(this.hand).map((id) => this.hand[id]);
  }

  getHandCardCount(): number {
    return Object.keys(this.hand).length;
  }

  playCard(cardId: string, parameters: CardParameters): ActionCard | PathCard {
    const card = this.hand[cardId];
    if (!card) {
      throw new Error("Cannot play card which isn't in players hand");
    }

    return card.play(parameters);
  }

  discardCard(cardId: string): Card {
    const card = this.hand[cardId];
    if (!card) {
      throw new Error("Cannot discard card which isn't in players hand");
    }

    this.removeFromHand(cardId);
    return card;
  }

  breakTool(tool: Tools): void {
    if (this.tools[tool] === false) {
      throw new Error(`Tool ${tool} is already broken`);
    }
    this.tools[tool] = false;
  }

  repairTool(tool: Tools): void {
    if (this.tools[tool] === true) {
      throw new Error(`Tool ${tool} does not need repaired`);
    }
    this.tools[tool] = true;
  }

  getTools(): { [key in Tools]: boolean } {
    return { ...this.tools };
  }

  setup(isSaboteur: boolean): void {
    this.hand = {};
    this.tools = {
      [Tools.pick]: true,
      [Tools.lamp]: true,
      [Tools.wagon]: true,
    };
    this.viewedFinishCards = {};
    this.isSaboteur = isSaboteur;
  }

  viewFinishCard(card: FinishPathCard): void {
    if (!(card instanceof FinishPathCard)) {
      throw new Error("Invalid finish card provided");
    }
    this.viewedFinishCards[card.id] = card;
  }

  getViewedFinishCards(): FinishPathCard[] {
    return Object.keys(this.viewedFinishCards).map(
      (id) => this.viewedFinishCards[id]
    );
  }

  toJSON(): Pojo {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      hand: this.hand,
      viewedFinishCards: this.viewedFinishCards,
      isSaboteur: this.isSaboteur,
      tools: this.tools,
    };
  }
}

export default Player;
