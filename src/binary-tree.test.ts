import * as bt from "./binary-tree";
import * as g from "./grid";
import * as r from "./random";

// always carves north
const verticalBinaryTree = bt.binaryTree(r.falseCoin);

// always carves east
const horizontalBinaryTree = bt.binaryTree(r.trueCoin);

const verticalGrid: g.Grid = {
  ...g.makeGrid([2, 2]),
  links: {
    0: [2],
    1: [3],
    2: [0, 3],
    3: [1, 2],
  },
};

const horizontalGrid: g.Grid = {
  ...g.makeGrid([2, 2]),
  links: {
    0: [1],
    1: [0, 3],
    2: [3],
    3: [1, 2],
  },
};

describe("binary tree algoritm", () => {
  it("unfair false coin", () => {
    const actual = verticalBinaryTree([2, 2]);
    expect(actual).toEqual(verticalGrid);
  });
  it("unfair true coin", () => {
    const actual = horizontalBinaryTree([2, 2]);
    expect(actual).toEqual(horizontalGrid);
  });
});
