import * as g from "./grid";
import * as r from "./random";
import * as p from "./plane";
import * as n from "./neighbors";
import * as c from "./cell-action";

type BinaryTree = (coin: r.Coin) => (dimension: p.Dimensions) => g.Grid;

export const binaryTree: BinaryTree = (coin) => (dimensions) => {
  const flipCoin = r.coinFlip(coin);

  return g.foldGridByCell((grid, cell) => {
    const action = c.cellAction(cell);

    switch (action) {
      case "CarveNorth":
        return g.carveNorth(grid, cell);
      case "CarveEast":
        return g.carveEast(grid, cell);
      case "FlipCoin":
        return flipCoin() ? g.carveEast(grid, cell) : g.carveNorth(grid, cell);
      case "DoNothing":
        return grid;
      default: {
        const never: never = action;
        throw new Error(`unknown action ${never}`);
      }
    }
  }, g.makeGrid(dimensions));
};

export const randomBinaryTree = binaryTree(r.fairCoin);
