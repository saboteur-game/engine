import { generateId, Pojo } from "../../utils";
import CardParameters from "./card-parameters";

export enum Status {
  unused = "unused",
  played = "played",
  discarded = "discarded",
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
    // TODO: Check if the state was unused and throw if it was anything else
    this.status = Status.discarded;
  }

  setPlayed(): void {
    // TODO: Check if the state was unused or played and throw if it was anything else
    this.status = Status.played;
  }

  toJS(): Pojo {
    return {
      id: this.id,
      status: this.status,
    };
  }
}

export default Card;
