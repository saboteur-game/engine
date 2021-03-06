import { generateId, Pojo } from "../../utils";
import CardParameters from "./card-parameters";

export enum Status {
  unused = "unused",
  played = "played",
  discarded = "discarded",
}

export enum Sides {
  top = 1,
  right = 2,
  bottom = 3,
  left = 4,
}

class Card {
  id: string;
  status: Status;

  constructor() {
    this.id = generateId();
    this.status = Status.unused;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  play(parameters: CardParameters): Card {
    return this;
  }

  setDiscarded(): void {
    if (this.status === Status.unused) {
      this.status = Status.discarded;
    } else {
      throw new Error("Card in unknown state to set as discarded");
    }
  }

  setPlayed(): void {
    if (this.status === Status.unused || this.status === Status.played) {
      this.status = Status.played;
    } else {
      throw new Error("Card in unknown state to set as played");
    }
  }

  toJSON(): Pojo {
    return {
      id: this.id,
      status: this.status,
    };
  }
}

export default Card;
