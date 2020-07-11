type CoinFlip = () => boolean;

export const coinFlip: CoinFlip = () => {
  return Math.random() < 0.5;
};
