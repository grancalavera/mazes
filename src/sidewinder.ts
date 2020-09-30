import { assertNever } from "./assert-never";
import { cellAction } from "./cell-action";
import { carveEast, carveNorth, Cell, foldGridByCell, Grid, makeGrid } from "./grid";
import { hasWestNeighbor } from "./neighbors";
import { isNonEmptyArray } from "./non-empty-array";
import { Dimensions } from "./plane";
import * as random from "./random";
import { Choice, Coin } from "./random";

type Sidewinder = (coin: Coin, choice: Choice) => (dimensions: Dimensions) => Grid;

export const sidewinder: Sidewinder = (coin, choice) => (dimensions) => {
  const flipCoin = random.coinFlip(coin);
  const choose = random.choose(choice);
  const seed = makeGrid(dimensions);
  let runOfCells: Cell[] = [];

  const runAlgorithm = foldGridByCell((result, cell) => {
    // this is an implementation detail: we need to flip the coin every time
    // to be able to test the deterministic coins. This can be resolved by
    // passing a list of coin flips as an argument
    const shouldCloseOut = !flipCoin();
    const action = cellAction(cell);
    runOfCells = hasWestNeighbor(cell.neighbors) ? runOfCells : [];
    runOfCells.push(cell);

    switch (action) {
      case "CarveEast":
        return carveEast(result, cell);
      case "CarveNorth":
        return carveNorth(result, cell);
      case "FlipCoin":
        if (shouldCloseOut && isNonEmptyArray(runOfCells)) {
          const choice = choose(runOfCells);
          runOfCells = [];
          return carveNorth(result, choice);
        } else if (shouldCloseOut) {
          throw new Error("sidewinder: unexpected empty run");
        } else {
          return carveEast(result, cell);
        }
      case "Done":
        return result;
      default:
        assertNever(action);
    }
  });

  return runAlgorithm(seed);
};

export const randomSidewinder = sidewinder(random.fairCoin, random.fairChoice);
