import { generateId, Pojo } from "../utils";

class Position {
  id: string;
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.id = generateId();
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `${this.x},${this.y}`;
  }

  toJS(): Pojo {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}

export default Position;
