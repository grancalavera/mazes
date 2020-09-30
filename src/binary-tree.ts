import { assertNever } from "./assert-never";
import { cellAction } from "./cell-action";
import { carveEast, carveNorth, foldGridByCell, Grid, makeGrid } from "./grid";
import { Dimensions } from "./plane";
import { Coin, coinFlip, fairCoin } from "./random";

type BinaryTree = (coin: Coin) => (dimension: Dimensions) => Grid;

export const binaryTree: BinaryTree = (coin) => (dimensions) => {
  const flipCoin = coinFlip(coin);
  const seed = makeGrid(dimensions);

  const runAlgorithm = foldGridByCell((grid, cell) => {
    const action = cellAction(cell);

    switch (action) {
      case "CarveNorth":
        return carveNorth(grid, cell);
      case "CarveEast":
        return carveEast(grid, cell);
      case "FlipCoin":
        return flipCoin() ? carveEast(grid, cell) : carveNorth(grid, cell);
      case "Done":
        return grid;
      default: {
        assertNever(action);
      }
    }
  });

  return runAlgorithm(seed);
};

export const randomBinaryTree = binaryTree(fairCoin);
