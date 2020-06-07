import { shuffle } from "../../utils";
import { Tools } from "../../constants";
import Card, { Sides } from "./card";
import {
  StartPathCard,
  GoldFinishPathCard,
  RockFinishPathCard,
  PassageCard,
  DeadendCard,
  PathCard,
} from "./path-cards";
import {
  MapActionCard,
  RockfallActionCard,
  BreakActionCard,
  RepairActionCard,
  ActionCard,
} from "./action-cards";

const multiply = (length: number, getValue: () => Card) =>
  new Array(length).fill(undefined).map(() => getValue());
const randomBoolean = () => Math.random() < 0.5;

/*
 * Saboteur cards
 * - 44 path cards
 *  -- 1 starting card
 *  -- 3 finishing cards
 *    --- 1 gold [Connected, 1-2-3-4]
 *    --- 2 rock
 *       ---- 1 [Connected 1-2]
 *       ---- 1 [Connected 1-4]
 *  -- 40 tunnel cards
 *    --- 31 passage cards
 *       ---- 3 passage [Connected 2-4]
 *       ---- 4 passage [Connected 1-3]
 *       ---- 4 passage [Connected 1-4]
 *       ---- 5 passage [Connected 1-2]
 *       ---- 5 passage [Connected 1-2-4]
 *       ---- 5 passage [Connected 1-2-3]
 *       ---- 5 passage [Connected 1-2-3-4]
 *    --- 9 dead-end cards
 *       ---- 1 dead-end [Connected 1]
 *       ---- 1 dead-end [Connected 2]
 *       ---- 1 dead-end [Connected 1-2]
 *       ---- 1 dead-end [Connected 1-3]
 *       ---- 1 dead-end [Connected 1-4]
 *       ---- 1 dead-end [Connected 2-4]
 *       ---- 1 dead-end [Connected 1-2-3]
 *       ---- 1 dead-end [Connected 1-2-4]
 *       ---- 1 dead-end [Connected 1-2-3-4]
 * - 27 action cards
 *  -- 6 map cards
 *  -- 3 rock-fall cards
 *  -- 9 break tool cards
 *    --- 3 pick
 *    --- 3 lamp
 *    --- 3 wagon
 *  -- 9 repair tool cards
 *    --- 2 pick
 *    --- 2 lamp
 *    --- 2 wagon
 *    --- 1 pick and lamp
 *    --- 1 pick and wagon
 *    --- 1 lamp and wagon
 *
 * Notes: Card connections
 *
 *        (1)
 *     +-------+
 *     |       |
 * (4) |       | (2)
 *     |       |
 *     +-------+
 *        (3)
 */

export interface IPlacedCards {
  start: StartPathCard;
  gold: GoldFinishPathCard;
  rock1: RockFinishPathCard;
  rock2: RockFinishPathCard;
}

export const getPlacedCards = (): IPlacedCards => {
  const start = new StartPathCard();
  const gold = new GoldFinishPathCard();
  const rock1 = new RockFinishPathCard([Sides.top, Sides.right]);
  const rock2 = new RockFinishPathCard([Sides.top, Sides.left]);

  [start, gold, rock1, rock2].forEach((card) => card.setPlayed());

  return { start, gold, rock1, rock2 };
};

export const getShuffledDeck = (): Array<ActionCard | PathCard> => {
  const pathCards = [
    ...multiply(
      3,
      () => new PassageCard([Sides.right, Sides.left], randomBoolean())
    ),
    ...multiply(
      4,
      () => new PassageCard([Sides.top, Sides.bottom], randomBoolean())
    ),
    ...multiply(
      4,
      () => new PassageCard([Sides.top, Sides.left], randomBoolean())
    ),
    ...multiply(
      5,
      () => new PassageCard([Sides.top, Sides.right], randomBoolean())
    ),
    ...multiply(
      5,
      () =>
        new PassageCard([Sides.top, Sides.right, Sides.left], randomBoolean())
    ),
    ...multiply(
      5,
      () =>
        new PassageCard([Sides.top, Sides.right, Sides.bottom], randomBoolean())
    ),
    ...multiply(
      5,
      () =>
        new PassageCard(
          [Sides.top, Sides.right, Sides.bottom, Sides.left],
          randomBoolean()
        )
    ),
    new DeadendCard([Sides.top], randomBoolean()),
    new DeadendCard([Sides.right], randomBoolean()),
    new DeadendCard([Sides.top, Sides.right], randomBoolean()),
    new DeadendCard([Sides.top, Sides.bottom], randomBoolean()),
    new DeadendCard([Sides.top, Sides.left], randomBoolean()),
    new DeadendCard([Sides.right, Sides.left], randomBoolean()),
    new DeadendCard([Sides.top, Sides.right, Sides.bottom], randomBoolean()),
    new DeadendCard([Sides.top, Sides.right, Sides.left], randomBoolean()),
    new DeadendCard(
      [Sides.top, Sides.right, Sides.bottom, Sides.left],
      randomBoolean()
    ),
  ] as Array<PathCard>;

  const actionCards = [
    ...multiply(6, () => new MapActionCard()),
    ...multiply(3, () => new RockfallActionCard()),
    ...multiply(3, () => new BreakActionCard(Tools.pick)),
    ...multiply(3, () => new BreakActionCard(Tools.lamp)),
    ...multiply(3, () => new BreakActionCard(Tools.wagon)),
    ...multiply(2, () => new RepairActionCard(Tools.pick)),
    ...multiply(2, () => new RepairActionCard(Tools.lamp)),
    ...multiply(2, () => new RepairActionCard(Tools.wagon)),
    new RepairActionCard([Tools.pick, Tools.lamp]),
    new RepairActionCard([Tools.pick, Tools.wagon]),
    new RepairActionCard([Tools.lamp, Tools.wagon]),
  ] as Array<ActionCard>;

  return shuffle(
    ([] as Array<ActionCard | PathCard>).concat(pathCards, actionCards)
  );
};
