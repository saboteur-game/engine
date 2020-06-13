import { PassageCard, TunnelCard } from "../src/models/cards/path-cards";
import { ActionCard } from "../src/models/cards/action-cards";
import { IBoardCardParameters } from "../src/models/cards/card-parameters";
import { Sides } from "../src/models/cards/card";
import Position from "../src/models/position";
import { Game, Player } from "..";
import { getOppositeSide } from "../src/utils/get-opposite-side";

const game = new Game();

const hasSides = (
  card: TunnelCard | ActionCard | undefined,
  sides: Sides[]
): boolean =>
  card instanceof PassageCard &&
  ((!card.isUpsideDown &&
    sides.every((side) => card.connectors.includes(side))) ||
    (card.isUpsideDown &&
      sides.every((side) => card.connectors.includes(getOppositeSide(side)))));

const findCardWith = (sides: Sides[]): PassageCard | undefined => {
  const player = game.getActivePlayer() as Player;
  const playableCard = player.getHand().find((card) => hasSides(card, sides));
  return playableCard as PassageCard;
};

const isRoundOver = (roundIndex: number): boolean => {
  const roundResults = (game.toJSON() as { roundResults: string[] })
    .roundResults;
  return roundResults.length > roundIndex;
};

const playCard = (card: TunnelCard, position: Position): void => {
  const player = game.getActivePlayer() as Player;
  try {
    game.playCard(player, card.id, { position } as IBoardCardParameters);
  } catch (e) {
    console.log("--- Error occurred ---");
    console.log(e);
    console.log(game.visualizeBoard());
    console.log(game.toJSON());
    throw e;
  }
};

const discardCard = () => {
  const player = game.getActivePlayer() as Player;
  game.discardCard(player, player.getHand()[0].id);
};

// game.on("*", function (this: { event: string }, ...args: unknown[]) {
//   console.log("Event", this.event);
// });

game.on("end-round", function ({ data: [roundIndex, results] }) {
  console.log(`Round ${roundIndex + 1} complete`);
  console.log(results.gameState.visual);
  const players = results.gameState.players;
  const goldDiggerIds = Object.keys(players).filter(
    (playerId) => !players[playerId].isSaboteur
  );
  console.log(
    "\nGold Diggers\n - " +
      goldDiggerIds.map((playerId) => players[playerId].name).join("\n - ")
  );
  const saboteurIds = Object.keys(players).filter(
    (playerId) => players[playerId].isSaboteur
  );
  console.log(
    "\nSaboteurs\n - " +
      saboteurIds.map((playerId) => players[playerId].name).join("\n - ")
  );
  console.log(
    "\n-------------------------------------------------------------\n"
  );
});

game.on("end-game", function ({ data: [winners] }) {
  console.log("\nGame over");
  console.log(
    " - " +
      (winners as { player: { name: string }; totalGold: number }[])
        .map(({ player, totalGold }) => `${player.name} has ${totalGold} gold`)
        .join("\n - ")
  );
});

const players = [
  new Player("Alice", 20),
  new Player("Bob", 25),
  new Player("Carol", 30),
  new Player("Dan", 35),
  new Player("Eve", 40),
];

players.forEach((player) => {
  game.addPlayer(player);
});

game.start();

for (let round = 0; round < 3; round++) {
  let lastCardWithTopConnectorPosition;
  let lastCardWithBottomConnectorPosition;

  // Route to middle finish card
  for (let i = 1; i <= 7; i++) {
    const player = game.getActivePlayer() as Player;
    const playableCard =
      !player.isSaboteur && findCardWith([Sides.left, Sides.right]);

    if (playableCard) {
      const card = playableCard as TunnelCard;
      if (hasSides(card, [Sides.top])) {
        lastCardWithTopConnectorPosition = new Position(i, 0);
      }
      if (hasSides(card, [Sides.bottom])) {
        lastCardWithBottomConnectorPosition = new Position(i, 0);
      }
      playCard(playableCard, new Position(i, 0));
    } else {
      discardCard();
      i--;
    }

    if (isRoundOver(round)) break;
  }

  if (isRoundOver(round)) continue;

  // Route to top finish card
  let routedUp = false;
  let routedUpRight = false;
  let upIteration = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const player = game.getActivePlayer() as Player;
    if (player.getHand().length === 0) break;

    const routeUpCard = findCardWith([Sides.top, Sides.bottom]);
    const routeRightCard = findCardWith([Sides.right, Sides.bottom]);
    const leftRightCard = findCardWith([Sides.right, Sides.left]);

    // We need to start routing up.
    // We're looking for a set of cards with connectors top and bottom
    // ██  ██
    // ██  ██
    // ██  ██
    if (
      !player.isSaboteur &&
      routeUpCard &&
      !routedUp &&
      lastCardWithTopConnectorPosition
    ) {
      playCard(
        routeUpCard,
        new Position(lastCardWithTopConnectorPosition.x, 1)
      );
      routedUp = true;

      // If we're already routing up, route to the right.
      // We're looking for a set of cards with connectors bottom and right
      // ██████
      // ██
      // ██  ██
    } else if (
      !player.isSaboteur &&
      routeRightCard &&
      routedUp &&
      !routedUpRight &&
      lastCardWithTopConnectorPosition
    ) {
      playCard(
        routeRightCard,
        new Position(lastCardWithTopConnectorPosition.x, 2)
      );
      routedUpRight = true;

      // If we're already routing up and to the right, keep going!
      // We're looking for a set of cards with connectors left and right
      // ██████
      //
      // ██████
    } else if (
      !player.isSaboteur &&
      leftRightCard &&
      routedUp &&
      routedUpRight &&
      lastCardWithTopConnectorPosition
    ) {
      if (lastCardWithTopConnectorPosition.x + upIteration === 8) break;
      playCard(
        leftRightCard,
        new Position(lastCardWithTopConnectorPosition.x + upIteration, 2)
      );
      upIteration += 1;
    } else {
      discardCard();
    }

    if (isRoundOver(round)) break;
  }

  if (isRoundOver(round)) continue;

  // Route to bottom finish card
  let routedDown = false;
  let routedDownRight = false;
  let downIteration = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const player = game.getActivePlayer() as Player;
    if (player.getHand().length === 0) break;

    const routeDownCard = findCardWith([Sides.top, Sides.bottom]);
    const routeRightCard = findCardWith([Sides.top, Sides.right]);
    const leftRightCard = findCardWith([Sides.right, Sides.left]);

    // We need to start routing down.
    // We're looking for a set of cards with connectors top and bottom
    // ██  ██
    // ██  ██
    // ██  ██
    if (
      !player.isSaboteur &&
      routeDownCard &&
      !routedDown &&
      lastCardWithBottomConnectorPosition
    ) {
      playCard(
        routeDownCard,
        new Position(lastCardWithBottomConnectorPosition.x, -1)
      );
      routedDown = true;

      // If we're already routing down, route to the right.
      // We're looking for a set of cards with connectors top and right
      // ██  ██
      // ██
      // ██████
    } else if (
      !player.isSaboteur &&
      routeRightCard &&
      routedDown &&
      !routedDownRight &&
      lastCardWithBottomConnectorPosition
    ) {
      playCard(
        routeRightCard,
        new Position(lastCardWithBottomConnectorPosition.x, -2)
      );
      routedDownRight = true;

      // If we're already routing down and to the right, keep going!
      // We're looking for a set of cards with connectors left and right
      // ██████
      //
      // ██████
    } else if (
      !player.isSaboteur &&
      leftRightCard &&
      routedDown &&
      routedDownRight &&
      lastCardWithBottomConnectorPosition
    ) {
      if (lastCardWithBottomConnectorPosition.x + downIteration === 8) break;
      playCard(
        leftRightCard,
        new Position(lastCardWithBottomConnectorPosition.x + downIteration, -2)
      );
      downIteration += 1;
    } else {
      discardCard();
    }

    if (isRoundOver(round)) break;
  }

  if (isRoundOver(round)) continue;
}
