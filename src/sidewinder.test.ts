import * as r from "./random";
import * as sw from "./sidewinder";
import { maze1, maze2, maze3 } from "./sidewinder-fixtures";

const sidewinder1 = sw.sidewinder(r.memoryCoin(true, 1), r.chooseFirst);
const sidewinder2 = sw.sidewinder(r.memoryCoin(true, 1), r.chooseLast);

describe("sidewinder algorithm", () => {
  it("4x4: true false first", () => {
    const actual = sidewinder1([4, 4]);
    expect(actual).toEqual(maze1);
  });

  it("4x4: true false last", () => {
    const actual = sidewinder2([4, 4]);
    expect(actual).toEqual(maze2);
  });

  it("5x5: true false first", () => {
    const actual = sidewinder1([5, 5]);
    expect(actual).toEqual(maze3);
  });
});
