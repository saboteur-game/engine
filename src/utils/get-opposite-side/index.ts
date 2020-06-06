import { Sides } from "../../models/cards/card";
import { SPACE_SIDES } from "../../constants";

export const getOppositeSide = (side: Sides): Sides => {
  if (!Sides[side]) throw new Error("Unknown side");
  return (side + SPACE_SIDES / 2) % SPACE_SIDES || SPACE_SIDES;
};
