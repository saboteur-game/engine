import { Sides } from "../../models/cards/card";
import { PathCard } from "../../models/cards/path-cards";
import { getOppositeSide } from "../get-opposite-side";

const getCardVisualization = (card: PathCard, center = "  "): string => {
  const getConnection = (passedSide: Sides): string => {
    const side = card.isUpsideDown ? getOppositeSide(passedSide) : passedSide;
    if (card.connectors.includes(side)) return "  ";
    return "██";
  };
  const top = `██${getConnection(Sides.top)}██`;
  const middle = `${getConnection(Sides.left)}${center}${getConnection(
    Sides.right
  )}`;
  const bottom = `██${getConnection(Sides.bottom)}██`;
  return `${top}\n${middle}\n${bottom}`;
};

export default getCardVisualization;
