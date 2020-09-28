import * as r from "./random";
import * as sw from "./sidewinder";
import { maze1, maze2 } from "./sidewinder-fixtures";

const sidewinder1 = sw.sidewinder(r.memoryCoin(true, 1), r.chooseFirst);
const sidewinder2 = sw.sidewinder(r.memoryCoin(true, 1), r.chooseLast);

describe("sidewinder algorithm", () => {
  it("true true first", () => {
    const actual = sidewinder1([4, 4]);
    expect(actual).toEqual(maze1);
  });
  it("true true false", () => {
    const actual = sidewinder2([4, 4]);
    expect(actual).toEqual(maze2);
  });
});
