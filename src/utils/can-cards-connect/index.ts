import { Sides } from "../../models/cards/card";
import { TunnelCard } from "../../models/cards/path-cards";
import { SPACE_SIDES } from "../../constants";

export const getOppositeSide = (side: Sides): Sides => {
  if (!Sides[side]) throw new Error("Unknown side");
  return (side + SPACE_SIDES / 2) % SPACE_SIDES || SPACE_SIDES;
};

function canCardsConnect(
  side: Sides,
  adjacentCard: TunnelCard | undefined,
  card: TunnelCard
): boolean {
  if (!adjacentCard) return true;

  const cardConnectors = card.connectors.map((connector) =>
    card.isUpsideDown ? getOppositeSide(connector) : connector
  );
  const adjacentCardConnectors = adjacentCard.connectors.map((connector) =>
    adjacentCard.isUpsideDown ? getOppositeSide(connector) : connector
  );

  const needsConnector = cardConnectors.includes(side);
  const hasConnector = adjacentCardConnectors.includes(getOppositeSide(side));
  return needsConnector === hasConnector;
}

export default canCardsConnect;
