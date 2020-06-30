import { makeGrid, linkCells, linksTo, unlinkCells } from "./grid";
import { Position } from "./plane";

describe("Grid.linkCells", () => {
  const a: Position = [0, 0];
  const b: Position = [1, 0];
  const g = makeGrid([2, 1]);
  const h = linkCells(g, a, b);
  const i = unlinkCells(h, a, b);

  it("by default cells should not be linked", () => {
    expect(linksTo(g, a, b)).toBe(false);
    expect(linksTo(g, b, a)).toBe(false);
  });

  it("link should be bidirectional", () => {
    expect(linksTo(h, a, b)).toBe(true);
    expect(linksTo(h, b, a)).toBe(true);
  });

  it("unlink should be bidirectional", () => {
    expect(linksTo(i, a, b)).toBe(false);
    expect(linksTo(i, b, a)).toBe(false);
  });
});
