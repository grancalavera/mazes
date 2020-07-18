import * as g from "./grid";
import * as r from "./random";
import * as p from "./plane";
import * as n from "./neighbors";

type Sidewinder = (
  coin: r.Coin,
  choice: r.Choice
) => (dimensions: p.Dimensions) => g.Grid;

export const sidewinder: Sidewinder = (coin, choice) => (dimensions) => {
  throw new Error("BOOM");
};

export const randomSidewinder = sidewinder(r.fairCoin, r.fairChoice);
