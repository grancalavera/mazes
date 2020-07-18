export type Coin = () => boolean;
export type CoinFlip = (flip: Coin) => () => boolean;
export type UnfairCoin = Coin;
export type FairCoin = Coin;
export type MemoryCoin = Coin;

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
