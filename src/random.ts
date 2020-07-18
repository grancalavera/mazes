import { none, Option, some } from "./option";

export type Coin = () => boolean;
export type CoinFlip = (flip: Coin) => () => boolean;
export type UnfairCoin = Coin;
export type FairCoin = Coin;
export type MemoryCoin = Coin;

export type Choice = <T>(xs: T[]) => Option<T>;
export type ChooseFirst = Choice;
export type ChooseLast = Choice;

export const fairCoin: FairCoin = () => Math.random() < 0.5;
export const falseCoin: UnfairCoin = () => false;
export const trueCoin: UnfairCoin = () => true;
export const coinFlip: CoinFlip = (flip) => () => flip();

export const memoryCoin = (start: boolean, remembers: number = 2): MemoryCoin => {
  let next = start;
  let count = 0;

  return () => {
    if (remembers < 0) {
      throw new Error("remembers must be an integer or zero");
    }

    const result = next;
    count += 1;
    next = count % Math.floor(remembers) === 0 ? !result : result;

    return result;
  };
};

export const fairChoice: Choice = (xs) => {
  if (xs.length === 0) {
    return none;
  }
  const index = getRandomInt(0, xs.length - 1);
  return some(xs[index]);
};

export const chooseFirst: ChooseFirst = (xs) => {
  const [first] = xs;
  return first === undefined ? none : some(first);
};

export const chooseLast: ChooseLast = (xs) => {
  const last = xs[xs.length - 1];
  return last === undefined ? none : some(last);
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 * https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 */
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
