import {
  ActionCard,
  RepairActionCard,
  BreakActionCard,
  MapActionCard,
  RockfallActionCard,
  ToolActionCard,
} from "./models/cards/action-cards";
import { FinishPathCard, PathCard } from "./models/cards/path-cards";
import Player from "./models/player";
import Board from "./models/board";
import {
  IToolActionCardParameters,
  IBoardCardParameters,
} from "./models/cards/card-parameters";
import Card from "./models/cards/card";

function performToolAction(playedCard: ToolActionCard): void {
  const {
    player: actionedPlayer,
    appliedTo,
  } = playedCard.parameters as IToolActionCardParameters;

  if (playedCard instanceof RepairActionCard) {
    actionedPlayer.repairTool(appliedTo);
  }

  if (playedCard instanceof BreakActionCard) {
    actionedPlayer.breakTool(appliedTo);
  }
}

function performRockfallAction(
  playedCard: RockfallActionCard,
  board: Board
): Card {
  const { position } = playedCard.parameters as IBoardCardParameters;
  return board.removeCard(position);
}

function performMapAction(
  playedCard: MapActionCard,
  player: Player,
  board: Board
): void {
  const { position } = playedCard.parameters as IBoardCardParameters;
  const card = board.getCardAt(position) as FinishPathCard;
  player.viewFinishCard(card);
}

function performPlay(
  playedCard: ActionCard | PathCard,
  player: Player,
  board: Board
): Card[] {
  // TODO: Update the game state with passed in card
  // If it's a path card - is it played against the board
  //  - Do not return this card as it's not discarded

  if (!playedCard.parameters) {
    throw new Error("Missing action parameters");
  }

  if (playedCard instanceof ToolActionCard) {
    performToolAction(playedCard);
    return [playedCard];
  }

  if (playedCard instanceof RockfallActionCard) {
    const removedCard = performRockfallAction(playedCard, board);
    return [removedCard, playedCard];
  }

  if (playedCard instanceof MapActionCard) {
    performMapAction(playedCard, player, board);
    return [playedCard];
  }

  throw new Error("Unknown card");
}

export default performPlay;
