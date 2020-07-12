import { makeGrid, linkCells, linksTo, unlinkCells, Row, rows } from "./grid";
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

  it("link should only link neighbors", () => {
    // 1 (1,0) (1,1)
    // 0 (0,0) (0,1)
    // - 0      1
    const x: Position = [0, 0];
    const y: Position = [1, 1];
    const j = makeGrid([2, 2]);
    const l = linkCells(j, x, y);
    expect(linksTo(l, x, y)).toBe(false);
  });
});

describe("Grid.rows", () => {
  const g = makeGrid([2, 2]);
  const expected = [
    [g.cells[0], g.cells[1]],
    [g.cells[2], g.cells[3]],
  ];

  it("returns the rows from a grid", () => {
    const actual = rows(g);
    expect(actual).toEqual(expected);
  });
});
