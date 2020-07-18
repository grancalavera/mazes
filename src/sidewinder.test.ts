import * as sw from "./sidewinder";
import * as g from "./grid";
import * as r from "./random";

const coin = r.memoryCoin(true, 2);
const sidewinder1 = sw.sidewinder(coin, r.chooseFirst);
const sidewinder2 = sw.sidewinder(coin, r.chooseLast);

const maze1: g.Grid = {
  ...g.makeGrid([4, 4]),
  links: {
    0: [4],
    1: [0],
    2: [3],
    3: [2, 7],
    4: [0, 5, 8],
    5: [4],
    6: [7],
    7: [3, 6, 11],
    8: [4, 9, 12],
    9: [8],
    10: [11],
    11: [7, 10, 15],
    12: [8, 13],
    13: [12, 14],
    14: [13, 15],
    15: [11, 14],
  },
};

const maze2: g.Grid = {
  ...g.makeGrid([4, 4]),
  links: {
    0: [1],
    1: [0, 5],
    2: [3],
    3: [2, 7],
    4: [5],
    5: [1, 4, 9],
    6: [7],
    7: [3, 6, 11],
    8: [9],
    9: [5, 8, 13],
    10: [11],
    11: [7, 10, 15],
    12: [13],
    13: [9, 12, 14],
    14: [13, 15],
    15: [11, 14],
  },
};

describe("sidewinder algorithm", () => {
  it("true true first", () => {
    const actual = sidewinder1([2, 2]);
    expect(actual).toEqual(maze1);
  });
  it("true true false", () => {
    const actual = sidewinder2([2, 2]);
    expect(actual).toEqual(maze2);
  });
});
