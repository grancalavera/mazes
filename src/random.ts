import { NonEmptyArray } from "./non-empty-array";

export type Coin = () => boolean;
export type CoinFlip = (flip: Coin) => () => boolean;

export const fairCoin: Coin = () => Math.random() < 0.5;
export const falseCoin: Coin = () => false;
export const trueCoin: Coin = () => true;

export const coinFlip: CoinFlip = (flip) => () => flip();

export const memoryCoin = (start: boolean, remembers: number = 2): Coin => {
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

export type Choice = <T>(xs: NonEmptyArray<T>) => T;
export type Choose = <T>(
  choice: (xs: NonEmptyArray<T>) => T
) => (options: NonEmptyArray<T>) => T;

export const choose: Choose = (f) => (l) => f(l);
export const fairChoice: Choice = (xs) => xs[getRandomInt(0, xs.length - 1)];
export const chooseFirst: Choice = (xs) => xs[0];
export const chooseLast: Choice = (xs) => xs[xs.length - 1];

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
