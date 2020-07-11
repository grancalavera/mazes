export type Coin = () => boolean;
export type CoinFlip = (flip: Coin) => () => boolean;
export type UnfairCoin = Coin;
export type FairCoin = Coin;

export const fairCoin: FairCoin = () => Math.random() < 0.5;
export const falseCoin: UnfairCoin = () => false;
export const trueCoin: UnfairCoin = () => true;
export const coinFlip: CoinFlip = (flip) => () => flip();
