import { generateId, Pojo } from "../../../utils";

class GoldRewardCard {
  id: string;
  value: number;

  constructor(value: 1 | 2 | 3) {
    this.id = generateId();
    this.value = value;
  }

  toJS(): Pojo {
    return {
      id: this.id,
      value: this.value,
    };
  }
}

export default GoldRewardCard;
