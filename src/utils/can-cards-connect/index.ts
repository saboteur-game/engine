import { Sides } from "../../models/cards/card";
import { TunnelCard, FinishPathCard } from "../../models/cards/path-cards";
import { getOppositeSide } from "../get-opposite-side";

function canCardsConnect(
  side: Sides,
  adjacentCard: TunnelCard | undefined,
  card: TunnelCard
): boolean {
  if (!adjacentCard) return true;

  // Finish paths can always be connected to when face down
  if (adjacentCard instanceof FinishPathCard && adjacentCard.isFaceDown) {
    return true;
  }

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
