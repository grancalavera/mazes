import { Direction, neighbors, Neighbors, toArray, walk } from "./neighbors";
import { isSome } from "./option";
import {
  Dimensions,
  Index,
  isEqual,
  Position,
  positionToIndex,
  unsafePositionFromIndex,
} from "./plane";
import { replicate } from "./replicate";

export interface Grid {
  readonly dimensions: Dimensions;
  readonly cells: Cell[];
  readonly links: Links;
}

export interface Cell {
  readonly index: Index;
  readonly pos: Position;
  readonly neighbors: Neighbors;
}

type FoldCell<T> = (acc: T, c: Cell, i?: Index, src?: Cell[]) => T;
type FoldRow<T> = (acc: T, r: Row, i?: Index, src?: Row[]) => T;

type FoldCells = <T>(f: FoldCell<T>, seed: T) => (g: Grid) => T;
type FoldRows = <T>(f: FoldRow<T>, seed: T) => (g: Grid) => T;

export const foldCells: FoldCells = <T>(f: FoldCell<T>, seed: T) => (g) =>
  g.cells.reduce(f, seed);

export const foldRows: FoldRows = <T>(f: FoldRow<T>, seed: T) => (g) =>
  rows(g).reduce(f, seed);

export const foldGridByCell = (f: FoldCell<Grid>, g: Grid): Grid => foldCells(f, g)(g);
export const foldGridByRow = (f: FoldRow<Grid>, g: Grid): Grid => foldRows(f, g)(g);

export const rows = (g: Grid) => {
  const rs: Row[] = [];
  for (const c of g.cells) {
    const [rowIndex, colIndex] = c.pos;
    const r = rs[rowIndex] ?? [];
    r[colIndex] = c;
    rs[rowIndex] = r;
  }
  return rs;
};

type Links = Record<Index, Index[] | undefined>;
type ChangeLink = (from: Index, to: Index) => (links: Links) => Links;

export type Row = Cell[];

export const makeGrid = (d: Dimensions): Grid => {
  return {
    dimensions: d,
    cells: [...Array(d[0] * d[1])].map((_, i) => makeCell(d, i)),
    links: {},
  };
};

const makeCell = (d: Dimensions, index: Index): Cell => {
  const pos = unsafePositionFromIndex(d)(index);
  return {
    index,
    pos,
    neighbors: neighbors(d)(pos),
  };
};

export const areNeighbors = (a: Cell, b: Cell): boolean =>
  isNeighborOf(a, b) && isNeighborOf(b, a);

const isNeighborOf = (cell: Cell, candidate: Cell): boolean =>
  !!toArray(cell.neighbors).find(isEqual(candidate.pos));

const carve = (direction: Direction) => (grid: Grid, cell: Cell): Grid => {
  const from = cell.pos;
  const to = cell.neighbors[direction];
  return isSome(to) ? linkCells(grid, from, to.value) : grid;
};

export const carveNorth = carve("north");
export const carveSouth = carve("south");
export const carveEast = carve("east");
export const carveWest = carve("west");

export const linkCells = (g: Grid, a: Position, b: Position): Grid =>
  withIndexes(g, a, b, g, (ia, ib) => {
    if (!areNeighbors(g.cells[ia], g.cells[ib])) {
      return g;
    }

    const fwd = addLink(ia, ib);
    const bwd = addLink(ib, ia);
    return { ...g, links: bwd(fwd(g.links)) };
  });

export const unlinkCells = (g: Grid, a: Position, b: Position): Grid =>
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
  a: Position,
  b: Position,
  fallback: T,
  f: (ia: Index, ib: Index) => T
): T => {
  const toIndex = positionToIndex(g.dimensions);
  const oa = toIndex(a);
  const ob = toIndex(b);
  return isSome(oa) && isSome(ob) ? f(oa.value, ob.value) : fallback;
};

export const linksTo = (g: Grid, a: Position, b: Position): boolean =>
  withIndexes(g, a, b, false, (ia, ib) => (g.links[ia] ?? []).includes(ib));

const hasLinkAt = (dir: Direction) => (g: Grid, c: Cell): boolean => {
  const here = c.pos;
  const there = walk(dir)(here);
  return linksTo(g, here, there);
};

export const hasLinkAtNorth = hasLinkAt("north");
export const hasLinkAtSouth = hasLinkAt("south");
export const hasLinkAtEast = hasLinkAt("east");
export const hasLinkAtWest = hasLinkAt("west");

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
