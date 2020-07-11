import * as n from "./neighbors";
import * as p from "./plane";
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

type Links = Record<p.Index, p.Index[] | undefined>;

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

type ChangeLink = (from: p.Index, to: p.Index) => (links: Links) => Links;
type FoldCell = (g: Grid, c: Cell, i?: p.Index, src?: Cell[]) => Grid;
type FoldCells = (f: FoldCell) => (g: Grid) => Grid;

export const foldCells: FoldCells = (f) => (g) => g.cells.reduce(f, g);

export const linksTo = (g: Grid, a: p.Position, b: p.Position): boolean =>
  withIndexes(g, a, b, false, (ia, ib) => (g.links[ia] ?? []).includes(ib));

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

// this is just applicative
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

export const print = (g: Grid): string =>
  g.cells
    .map(({ pos: [r, c], neighbors }) => {
      const newline = n.hasEastNeighbor(neighbors) ? "" : "\n";
      return `(${r},${c})${newline}`;
    })
    .join("");

/*
+---+---+
|000|000|
+---+---+
|000|000|
+---+---+

blank
000000000;
000000000;
000000000;
000000000;
000000000;

top
+---+---0;
000000000;
000000000;
000000000;
000000000;

right
00000000+;
00000000|;
00000000+;
00000000|;
000000000;

(0,0)
000000000;
000000000;
000000000;
|00000000;
+---00000;

(0,1)
000000000;
000000000;
000000000;
0000|0000;
0000+---0;

(1,0)
000000000;
|00000000;
*---00000;
000000000;
000000000;

(1,1)
000000000;
0000|0000;
0000*---0;
000000000;
000000000;
*/
