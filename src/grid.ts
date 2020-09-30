import { Direction, neighbors, Neighbors, toArray, walk } from "./neighbors";
import { isSome, isNone, Option, none, some } from "./option";
import {
  Dimensions,
  Index,
  isEqual,
  Position,
  positionToIndex,
  unsafePositionFromIndex,
} from "./plane";
import { link } from "fs/promises";

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
type FoldCells = <T>(f: FoldCell<T>, seed: T) => (g: Grid) => T;

const foldCells: FoldCells = <T>(f: FoldCell<T>, seed: T) => (g) =>
  g.cells.reduce(f, seed);

export const foldGridByCell = (f: FoldCell<Grid>) => (g: Grid): Grid =>
  foldCells(f, g)(g);

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

const areNeighbors = (a: Cell, b: Cell): boolean =>
  isNeighborOf(a, b) && isNeighborOf(b, a);

const isNeighborOf = (cell: Cell, candidate: Cell): boolean =>
  !!toArray(cell.neighbors).find(([p]) => isEqual(candidate.pos)(p));

const carve = (direction: Direction) => (grid: Grid, cell: Cell): Grid => {
  const from = cell.pos;
  const to = cell.neighbors[direction];
  return isSome(to) ? linkCells(grid, from, to.value[0]) : grid;
};

export const carveNorth = carve("north");
export const carveSouth = carve("south");
export const carveEast = carve("east");
export const carveWest = carve("west");

export const links = (g: Grid, p: Position): Cell[] => {
  const cellAt = cellAtPosition(g);

  const cellOption = cellAt(p);
  if (isNone(cellOption)) return [];

  return toArray(cellOption.value.neighbors)
    .filter(([np]) => linksTo(g, p, np))
    .map(([np]) => cellAt(np))
    .filter(isSome)
    .map((x) => x.value);
};

export const cellAtPosition = (g: Grid) => (p: Position): Option<Cell> => {
  const indexOption = positionToIndex(g.dimensions)(p);
  return isSome(indexOption) ? some(g.cells[indexOption.value]) : none;
};

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

// one day...
// https://jelv.is/blog/Generating-Mazes-with-Inductive-Graphs/

export const distances = (g: Grid, p: Position): Option<Record<number, number>> => {
  const cellOption = cellAtPosition(g)(p);

  if (isNone(cellOption)) return none;
  const cell = cellOption.value;

  const result: Record<number, number> = {
    [cell.index]: 0,
  };

  let frontier: Cell[] = [cell];

  while (frontier.length > 0) {
    const newFrontier: Cell[] = [];

    frontier
      .flatMap((c) => links(g, c.pos).map((l) => [c, l] as const))
      .forEach(([c, l]) => {
        const visited = Number.isInteger(result[l.index]);
        if (!visited) {
          result[l.index] = result[c.index] + 1;
          newFrontier.push(l);
        }
      });

    frontier = newFrontier;
  }

  return some(result);
};
