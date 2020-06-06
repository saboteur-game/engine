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

```
$  npx ts-node ./example/index.ts
```

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
