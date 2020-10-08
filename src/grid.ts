import { Direction, neighbors, Neighbors, toArray, walk } from "./neighbors";
import { isSome, none, Option, some } from "./option";
import {
  Dimensions,
  Index,
  isEqual,
  Position,
  positionToIndex,
  unsafePositionFromIndex,
} from "./plane";
import {
  addLink as tgAddLink,
  distances as tgDistances,
  shortestPath as tgShortestPath,
  TinyDistances,
  TinyGraph,
} from "./tiny-graph";

export interface Grid {
  readonly dimensions: Dimensions;
  readonly cells: Cell[];
  readonly graph: TinyGraph;
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

export type Row = Cell[];

export const makeGrid = (d: Dimensions): Grid => {
  const nodes = [...Array(d[0] * d[1])].map((_, i) => i);
  return {
    dimensions: d,
    cells: nodes.map(makeCell(d)),
    graph: Object.fromEntries(nodes.map((n) => [n, []])),
  };
};

const makeCell = (d: Dimensions) => (index: Index): Cell => {
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

export const cellAtPosition = (g: Grid) => (p: Position): Option<Cell> => {
  const indexOption = positionToIndex(g.dimensions)(p);
  return isSome(indexOption) ? some(g.cells[indexOption.value]) : none;
};

export const linkCells = (g: Grid, a: Position, b: Position): Grid =>
  withIndexes(g, a, b, g, (ia, ib) => {
    if (!areNeighbors(g.cells[ia], g.cells[ib])) {
      return g;
    }

    const result = tgAddLink(g.graph, ia, ib);

    if (isSome(result)) {
      return { ...g, graph: result.value };
    } else {
      return g;
    }
  });

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
  withIndexes(g, a, b, false, (ia, ib) => (g.graph[ia] ?? []).includes(ib));

const hasLinkAt = (dir: Direction) => (g: Grid, c: Cell): boolean => {
  const here = c.pos;
  const there = walk(dir)(here);
  return linksTo(g, here, there);
};

export const hasLinkAtNorth = hasLinkAt("north");
export const hasLinkAtSouth = hasLinkAt("south");
export const hasLinkAtEast = hasLinkAt("east");
export const hasLinkAtWest = hasLinkAt("west");

export const distances = (grid: Grid, p: Position): TinyDistances => {
  const indexOption = positionToIndex(grid.dimensions)(p);
  return isSome(indexOption) ? tgDistances(grid.graph, indexOption.value) : {};
};

export const shortestPath = (grid: Grid, p: Position): readonly Index[] => {
  const indexOption = positionToIndex(grid.dimensions)(p);
  return isSome(indexOption) ? tgShortestPath(grid.graph, indexOption.value) : [];
};
