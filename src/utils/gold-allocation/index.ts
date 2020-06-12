import { MAX_REWARD_CARDS, saboteurGoldAllocation } from "../../constants";
import Player from "../../models/player";
import GoldRewardCard from "../../models/cards/gold-reward-cards";
import RewardDeck from "../../models/reward-deck";
import { wrapIndexAt } from "../";

interface IGoldAllocation {
  [key: string]: GoldRewardCard[];
}

interface IPlayers {
  [key: string]: Player;
}

const getSuccessfulGoldDigger = (
  successfulPlayer: Player,
  playOrder: string[],
  players: IPlayers
): Player => {
  // If the saboteur reveals the gold finish card, the gold gets handed out
  // counter-clockwise starting from the dwarf who played last.
  // https://boardgamegeek.com/thread/82149/article/735273#735273
  if (successfulPlayer.isSaboteur) {
    const getIndex = wrapIndexAt(playOrder.length - 1);
    const startIndex = playOrder.indexOf(successfulPlayer.id);
    for (let i = 0; i < playOrder.length; i++) {
      const playerIndex = getIndex(startIndex - i);
      const nextPlayer = players[playOrder[playerIndex]];
      if (!nextPlayer.isSaboteur) return nextPlayer;
    }
  }

  return successfulPlayer;
};

const allocateGoldToGoldDiggers = (
  rewardDeck: RewardDeck,
  playOrder: string[],
  players: IPlayers,
  activePlayer: Player
): IGoldAllocation => {
  const goldAllocation: IGoldAllocation = {};

  const numberOfPlayers = playOrder.length;
  const numberOfRewardCards = Math.min(numberOfPlayers, MAX_REWARD_CARDS);
  const startingPlayer = getSuccessfulGoldDigger(
    activePlayer,
    playOrder,
    players
  );
  const goldDiggers = playOrder.filter(
    (playerId) => !players[playerId].isSaboteur
  );

  const startingPlayerIndex = goldDiggers.indexOf(startingPlayer.id);
  const getIndex = wrapIndexAt(goldDiggers.length - 1);
  for (let i = 0; i < numberOfRewardCards; i++) {
    const playerId = goldDiggers[getIndex(startingPlayerIndex - i)];
    const reward = rewardDeck.drawCard();
    if (reward) {
      goldAllocation[playerId] = (goldAllocation[playerId] || []).concat(
        reward
      );
    }
  }

  return goldAllocation;
};

const allocateGoldToSaboteurs = (
  rewardDeck: RewardDeck,
  playOrder: string[],
  players: IPlayers
): IGoldAllocation => {
  const goldAllocation: IGoldAllocation = {};

  const saboteurs = playOrder.filter(
    (playerId) => players[playerId].isSaboteur
  );
  const goldRewardAmount = saboteurGoldAllocation[saboteurs.length];
  saboteurs.forEach((playerId) => {
    goldAllocation[playerId] = (goldAllocation[playerId] || []).concat(
      rewardDeck.extractCardsToValue(goldRewardAmount)
    );
  });
  return goldAllocation;
};

export {
  IGoldAllocation,
  IPlayers,
  allocateGoldToGoldDiggers,
  allocateGoldToSaboteurs,
};
