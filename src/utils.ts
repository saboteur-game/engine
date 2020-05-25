import { v4 as uuidv4 } from "uuid";

const generateId = () => uuidv4();

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

export { generateId, shuffle, Pojo };
