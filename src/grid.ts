import * as n from "./neighbors";
import * as p from "./plane";
import { replicate } from "./replicate";
import { isSome } from "./option";

export interface Cell {
  readonly index: p.Index;
  readonly pos: p.Position;
  readonly neighbors: n.Neighbors;
}

export interface Grid {
  readonly dimensions: p.Dimensions;
  readonly cells: Cell[];
  readonly links: Links;
}

type FoldCell<T> = (acc: T, c: Cell, i?: p.Index, src?: Cell[]) => T;
type FoldRow<T> = (acc: T, r: Row, i?: p.Index, src?: Row[]) => T;

type FoldCells = <T>(f: FoldCell<T>, seed: T) => (g: Grid) => T;
type FoldRows = <T>(f: FoldRow<T>, seed: T) => (g: Grid) => T;

export const foldCells: FoldCells = <T>(f: FoldCell<T>, seed: T) => (g) =>
  g.cells.reduce(f, seed);

export const foldRows: FoldRows = <T>(f: FoldRow<T>, seed: T) => (g) =>
  rows(g).reduce(f, seed);

export const foldGridByCell = (f: FoldCell<Grid>, g: Grid): Grid => foldCells(f, g)(g);
export const foldGridByRow = (f: FoldRow<Grid>, g: Grid): Grid => foldRows(f, g)(g);

export const rows = (g: Grid) =>
  foldCells<Row[]>((rs, c) => {
    const {
      pos: [rowIndex, colIndex],
    } = c;

    const row = rs[rowIndex] ?? [];
    row[colIndex] = c;
    rs[rowIndex] = row;
    return rs;
  }, [])(g);

type Links = Record<p.Index, p.Index[] | undefined>;
type ChangeLink = (from: p.Index, to: p.Index) => (links: Links) => Links;

export type Row = Cell[];

export const makeGrid = (d: p.Dimensions): Grid => {
  return {
    dimensions: d,
    cells: [...Array(d[0] * d[1])].map((_, i) => makeCell(d, i)),
    links: {},
  };
};

const makeCell = (d: p.Dimensions, index: p.Index): Cell => {
  const pos = p.unsafePositionFromIndex(d)(index);
  return {
    index,
    pos,
    neighbors: n.neighbors(d)(pos),
  };
};

export const areNeighbors = (a: Cell, b: Cell): boolean =>
  isNeighborOf(a, b) && isNeighborOf(b, a);

const isNeighborOf = (cell: Cell, candidate: Cell): boolean =>
  !!n.toArray(cell.neighbors).find(p.isEqual(candidate.pos));

const carve = (direction: n.Direction) => (grid: Grid, cell: Cell): Grid => {
  const from = cell.pos;
  const to = cell.neighbors[direction];
  return isSome(to) ? linkCells(grid, from, to.value) : grid;
};

export const carveNorth = carve("north");
export const carveSouth = carve("south");
export const carveEast = carve("east");
export const carveWest = carve("west");

export const linkCells = (g: Grid, a: p.Position, b: p.Position): Grid =>
  withIndexes(g, a, b, g, (ia, ib) => {
    if (!areNeighbors(g.cells[ia], g.cells[ib])) {
      return g;
    }

    const fwd = addLink(ia, ib);
    const bwd = addLink(ib, ia);
    return { ...g, links: bwd(fwd(g.links)) };
  });

export const unlinkCells = (g: Grid, a: p.Position, b: p.Position): Grid =>
  withIndexes(g, a, b, g, (ia, ib) => {
    const fwd = removeLink(ia, ib);
    const bwd = removeLink(ib, ia);
    return { ...g, links: bwd(fwd(g.links)) };
  });

const addLink: ChangeLink = (from, to) => (links) => {
  const linkSet = new Set([...(links[from] ?? []), to]);
  return { ...links, [from]: Array.from(linkSet) };
};

const removeLink: ChangeLink = (from, to) => (links) => {
  return {
    ...links,
    [from]: (links[from] ?? []).filter((candidate) => candidate !== to),
  };
};

const withIndexes = <T>(
  g: Grid,
  a: p.Position,
  b: p.Position,
  fallback: T,
  f: (ia: p.Index, ib: p.Index) => T
): T => {
  const toIndex = p.positionToIndex(g.dimensions);
  const oa = toIndex(a);
  const ob = toIndex(b);
  return isSome(oa) && isSome(ob) ? f(oa.value, ob.value) : fallback;
};

export const linksTo = (g: Grid, a: p.Position, b: p.Position): boolean =>
  withIndexes(g, a, b, false, (ia, ib) => (g.links[ia] ?? []).includes(ib));

const hasLinkAt = (dir: n.Direction) => (g: Grid, c: Cell): boolean => {
  const here = c.pos;
  const there = n.walk(dir)(here);
  return linksTo(g, here, there);
};

const hasLinkAtNorth = hasLinkAt("north");
const hasLinkAtSouth = hasLinkAt("south");
const hasLinkAtEast = hasLinkAt("east");
const hasLinkAtWest = hasLinkAt("west");

export const print = (g: Grid): string => {
  let output = `+${replicate(g.dimensions[1])("---+").join("")}\n`;
  rows(g)
    .reverse()
    .forEach((row) => {
      let top = "|";
      let bottom = "+";
      row.forEach((cell) => {
        const body = "   ";
        const eastBoundary = hasLinkAtEast(g, cell) ? " " : "|";
        top += body + eastBoundary;
        const southBoundary = hasLinkAtSouth(g, cell) ? "   " : "---";
        bottom += southBoundary + "+";
      });
      output += top + "\n" + bottom + "\n";
    });

  return output;
};
