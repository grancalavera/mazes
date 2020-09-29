import * as g from "./grid";
import * as r from "./random";
import * as p from "./plane";
import * as c from "./cell-action";
import { isNonEmptyArray } from "./non-empty-array";
import { assertNever } from "./assert-never";

type Sidewinder = (
  coin: r.Coin,
  choice: r.Choice
) => (dimensions: p.Dimensions) => g.Grid;

export const sidewinder: Sidewinder = (coin, choice) => (dimensions) => {
  const flipCoin = r.coinFlip(coin);
  const choose = r.choose(choice);

  return g.foldGridByRow((grid, row) => {
    let result = grid;
    let run: g.Cell[] = [];

    row.forEach((cell) => {
      // this is an implementation detail: we need to flip the coin every time
      // to be able to test the deterministic coins. This can be resolved by
      // passing a list of coin flips as an argument
      const shouldCloseOut = !flipCoin();
      const action = c.cellAction(cell);
      run.push(cell);

      switch (action) {
        case "CarveEast":
          result = g.carveEast(result, cell);
          break;
        case "CarveNorth":
          result = g.carveNorth(result, cell);
          break;
        case "FlipCoin":
          if (shouldCloseOut && isNonEmptyArray(run)) {
            result = g.carveNorth(result, choose(run));
            run = [];
          } else if (shouldCloseOut) {
            throw new Error("unexpected empty run");
          } else {
            result = g.carveEast(result, cell);
          }
          break;
        case "DoNothing":
          break;
        default:
          assertNever(action);
      }
    });
    return result;
  }, g.makeGrid(dimensions));
};

export const randomSidewinder = sidewinder(r.fairCoin, r.fairChoice);
