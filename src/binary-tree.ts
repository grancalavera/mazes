import * as g from "./grid";
import * as r from "./random";
import * as p from "./plane";
import * as n from "./neighbors";

type BinaryTree = (coin: r.Coin) => (dimension: p.Dimensions) => g.Grid;
type Action = "CarveNorth" | "CarveEast" | "DoNothing" | "FlipCoin";

type CellAction = (cell: g.Cell) => Action;

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
  const grid = g.makeGrid(dimensions);
  const flip = r.coinFlip(coin);

  return g.foldCells((gr, cs) => {
    const action = cellAction(cs);
    switch (action) {
      case "CarveNorth":
        return g.carveNorth(gr, cs);
      case "CarveEast":
        return g.carveEast(gr, cs);
      case "FlipCoin":
        return flip() ? g.carveEast(gr, cs) : g.carveNorth(gr, cs);
      case "DoNothing":
        return gr;
      default: {
        const never: never = action;
        throw new Error(`unknown action ${never}`);
      }
    }
  })(grid);
};

export const randomBinaryTree = binaryTree(r.fairCoin);
