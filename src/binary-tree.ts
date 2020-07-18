import * as sw from "./grid";
import * as r from "./random";
import * as p from "./plane";
import * as n from "./neighbors";

type BinaryTree = (coin: r.Coin) => (dimension: p.Dimensions) => sw.Grid;
type Action = "CarveNorth" | "CarveEast" | "DoNothing" | "FlipCoin";

type CellAction = (cell: sw.Cell) => Action;

const cellAction: CellAction = (cell) => {
  const { neighbors } = cell;
  if (n.hasNorthNeighbor(neighbors) && n.hasEastNeighbor(neighbors)) {
    return "FlipCoin";
  }
  if (n.hasNorthNeighbor(neighbors) && !n.hasEastNeighbor(neighbors)) {
    return "CarveNorth";
  }
  if (n.hasEastNeighbor(neighbors) && !n.hasNorthNeighbor(neighbors)) {
    return "CarveEast";
  }
  return "DoNothing";
};

export const binaryTree: BinaryTree = (coin) => (dimensions) => {
  const flipCoin = r.coinFlip(coin);

  return sw.foldGridByCell((grid, cell) => {
    const action = cellAction(cell);

    switch (action) {
      case "CarveNorth":
        return sw.carveNorth(grid, cell);
      case "CarveEast":
        return sw.carveEast(grid, cell);
      case "FlipCoin":
        return flipCoin() ? sw.carveEast(grid, cell) : sw.carveNorth(grid, cell);
      case "DoNothing":
        return grid;
      default: {
        const never: never = action;
        throw new Error(`unknown action ${never}`);
      }
    }
  }, sw.makeGrid(dimensions));
};

export const randomBinaryTree = binaryTree(r.fairCoin);
