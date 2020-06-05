import {
  ActionCard,
  RepairActionCard,
  BreakActionCard,
  MapActionCard,
  RockfallActionCard,
  ToolActionCard,
} from "./models/cards/action-cards";
import { FinishPathCard, TunnelCard } from "./models/cards/path-cards";
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

function performPathAction(playedCard: TunnelCard, board: Board): void {
  const { position } = playedCard.parameters as IBoardCardParameters;
  board.addCard(playedCard, position);
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
  playedCard: ActionCard | TunnelCard,
  player: Player,
  board: Board
): Card[] {
  if (!playedCard.parameters) {
    throw new Error("Missing action parameters");
  }

  if (playedCard instanceof TunnelCard) {
    performPathAction(playedCard, board);
    return []; // Tunnel cards are played to the board and not discarded
  }

  if (playedCard instanceof ToolActionCard) {
    performToolAction(playedCard);
    return [playedCard];
  }

  if (playedCard instanceof RockfallActionCard) {
    const removedCard = performRockfallAction(playedCard, board);
    return [removedCard, playedCard]; // Discard both the action card and the removed tunnel card
  }

  if (playedCard instanceof MapActionCard) {
    performMapAction(playedCard, player, board);
    return [playedCard];
  }

  throw new Error("Unknown card");
}

export default performPlay;
