import * as g from "./grid";
import * as r from "./random";
import * as p from "./plane";
import * as n from "./neighbors";

type Action = "CarveEast" | "CarveNorth" | "ChooseCell" | "DoNothing";

type CellAction = (cell: g.Cell) => Action;

const cellAction: CellAction = (cell) => {
  throw new Error("cellAction not implemented");
};

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
