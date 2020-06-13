import { generateId, Pojo } from "../utils";

class Position {
  id: string;
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.id = generateId();
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `${this.x},${this.y}`;
  }

  above(): Position {
    return new Position(this.x, this.y + 1);
  }

  below(): Position {
    return new Position(this.x, this.y - 1);
  }

  left(): Position {
    return new Position(this.x - 1, this.y);
  }

  right(): Position {
    return new Position(this.x + 1, this.y);
  }

  toJSON(): Pojo {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}

export default Position;
