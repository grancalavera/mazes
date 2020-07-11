type Coin = () => boolean;
type CoinFlip = (flip: Coin) => () => boolean;
type UnfairCoin = Coin;
type FairCoin = Coin;

export const fairCoin: FairCoin = () => Math.random() < 0.5;
export const headsCoin: UnfairCoin = () => false;
export const tailsCoin: UnfairCoin = () => true;
export const coinFlip: CoinFlip = (flip) => () => flip();
