import * as g from "./grid";
import * as r from "./random";
import * as p from "./plane";
import * as c from "./cell-action";
import { isNonEmptyArray } from "./non-empty-array";

type Sidewinder = (
  coin: r.Coin,
  choice: r.Choice
) => (dimensions: p.Dimensions) => g.Grid;

export const sidewinder: Sidewinder = (coin, choice) => (dimensions) => {
  const flipCoin = r.coinFlip(coin);
  const choose = r.choose(choice);

  return g.foldGridByRow((grid, row) => {
    let newG = grid;
    let runBeginsAt = 0;

    row.forEach((cell, index) => {
      const action = c.cellAction(cell);
      const shouldCarveEast = flipCoin();

      switch (action) {
        case "CarveEast":
          newG = g.carveEast(newG, cell);
          break;
        case "CarveNorth":
          newG = g.carveNorth(newG, cell);
          break;
        case "FlipCoin": {
          if (shouldCarveEast) {
            newG = g.carveEast(newG, cell);
          } else {
            const runEndsAt = index + 1;
            const rowSlice = row.slice(runBeginsAt, runEndsAt);

            if (isNonEmptyArray(rowSlice)) {
              const cellToCarve = choose(rowSlice);
              newG = g.carveNorth(newG, cellToCarve);
            }

            runBeginsAt = index;
          }

          break;
        }
        case "DoNothing":
          break;
        default: {
          const never: never = action;
          throw new Error(`unknown action ${never}`);
        }
      }
    });

    return newG;
  }, g.makeGrid(dimensions));
};

export const randomSidewinder = sidewinder(r.fairCoin, r.fairChoice);
