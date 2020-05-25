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

console.log(JSON.stringify(game, null, 4));
