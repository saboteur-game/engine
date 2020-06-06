import { PassageCard } from "../src/models/cards/path-cards";
import { IBoardCardParameters } from "../src/models/cards/card-parameters";
import { Sides } from "../src/models/cards/card";
import Position from "../src/models/position";
import { Game, Player } from "..";

const game = new Game();

game.on("*", function (this: { event: string }, ...args: unknown[]) {
  console.log("Event", this.event, args);
});

const players = [
  new Player("Alice", 20),
  new Player("Bob", 25),
  new Player("Carol", 30),
  new Player("Dan", 35),
];

players.forEach((player) => {
  game.addPlayer(player);
});

game.start();

for (let i = 1; i <= 5; i++) {
  const player = game.getActivePlayer() as Player;
  const playableCard = player
    .getHand()
    .find(
      (card) =>
        card instanceof PassageCard && card.connectors.includes(Sides.left)
    );

  if (playableCard) {
    console.log((playableCard as PassageCard).visualize());
    game.playCard(player, playableCard.id, {
      position: new Position(i, 0),
    } as IBoardCardParameters);
  } else {
    game.discardCard(player, player.getHand()[0].id);
    i--;
  }
}

console.log("\n-------------------------------------------------\n");
console.log(game.visualizeBoard());
console.log("\n-------------------------------------------------\n");

// console.log(JSON.stringify(game, null, 4));
