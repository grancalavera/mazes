import * as g from "./grid";
import * as r from "./random";
import * as p from "./plane";

type Sidewinder = (
  coin: r.Coin,
  choice: r.Choice
) => (dimensions: p.Dimensions) => g.Grid;

export const sidewinder: Sidewinder = (coin, choice) => (dimensions) => {
  const flipCoin = r.coinFlip(coin);
  const choose = r.choose(choice);
  return g.foldGridByRow((grid, row) => {
    return grid;
  }, g.makeGrid(dimensions));
};

export const randomSidewinder = sidewinder(r.fairCoin, r.fairChoice);
