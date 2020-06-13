# ⛏️ Saboteur Engine

This repository implements the state and rules of the board game Saboteur. This
engine could then used to power a service for online play, embedded in a client
for local play, etc.

## Useful links

- Board Game Geek: https://boardgamegeek.com/boardgame/9220/saboteur
- Official rules:
  https://github.com/saboteur-game/engine/files/4692359/Saboteur_US_Rules.pdf

## Developing

This repository is a work in progress. Active tasks can be found on
[the engine build project](https://github.com/orgs/saboteur-game/projects/1).

### 🏎️ Getting Started

1. Clone this repository
   ```
   $  git clone git@github.com:saboteur-game/engine.git
   ```
2. Install dependencies
   ```
   $  npm install
   ```

### Running the example

There is an example simulation of running the game. This attempts to play tunnel
cards to route to first the middle final card, then top final card, and lastly
the bottom final card. Saboteur players do not help and just discard. There are
no action cards played or any attempt to find out which final card is the gold
card.

This can be run with

```
$  npm run example
```

It will output the final board state and the allegiance of each player after
each round. At the end of the game, the scoreboard is output with the amount of
gold taken for each player.

### 🛠️ Tools

#### 🧪 Testing

Tests are written using [`jest`](https://jestjs.io/) test framework.

```
$  npm test
```

#### 📰 Linting

Linting is powered by [eslint](https://eslint.org/) and
[prettier](https://prettier.io/), and will also include type checking by
[TypeScript](https://www.typescriptlang.org/).

```
$  npm run lint
```

You can also have automatic fixes applied, which can be useful for fixing
formatting issues with prettier.

```
$  npm run lint.fix
```
