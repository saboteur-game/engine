import { v4 as uuidv4 } from "uuid";

const generateId = (): string => uuidv4();

// https://stackoverflow.com/a/2450976
function shuffle<T>(originalArray: T[]): T[] {
  const array = [...originalArray];
  let currentIndex = array.length;
  let currentValue;
  let randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    currentValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = currentValue;
  }

  return array;
}

interface Pojo {
  [key: string]: unknown;
}

const multiply = <T>(length: number, getValue: () => T): T[] =>
  new Array(length).fill(undefined).map(() => getValue());

const randomBoolean = (): boolean => Math.random() < 0.5;

const wrapIndexAt = (max: number) => (index: number): number => {
  if (index > max) return index % max;
  if (index < 0) return max + (index % max);
  return index;
};

export { generateId, shuffle, multiply, randomBoolean, wrapIndexAt, Pojo };
