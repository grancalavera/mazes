import * as n from "./neighbors";
import { isSome } from "./option";
import {
  Dimensions,
  Index,
  Position,
  positionToIndex,
  unsafePositionFromIndex,
} from "./plane";

interface Cell {
  readonly index: Index;
  readonly pos: Position;
  readonly neighbors: n.Neighbors;
}

interface Grid {
  readonly dimensions: Dimensions;
  readonly cells: Cell[];
  readonly links: Links;
}

type Links = Record<Index, Index[] | undefined>;

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
    neighbors: n.neighbors(d)(pos),
  };
};

type ChangeLink = (from: Index, to: Index) => (links: Links) => Links;
type FoldCell = (g: Grid, c: Cell, i?: Index, src?: Cell[]) => Grid;
type FoldCells = (f: FoldCell) => (g: Grid) => Grid;

export const foldCells: FoldCells = (f) => (g) => g.cells.reduce(f, g);

export const linksTo = (g: Grid, a: Position, b: Position): boolean =>
  withIndexes(g, a, b, false, (ia, ib) => (g.links[ia] ?? []).includes(ib));

export const linkCells = (g: Grid, a: Position, b: Position): Grid =>
  withIndexes(g, a, b, g, (ia, ib) => {
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

// this is just applicative
const withIndexes = <T>(
  g: Grid,
  a: Position,
  b: Position,
  fallback: T,
  f: (ia: Index, ib: Index) => T
): T => {
  const p = positionToIndex(g.dimensions);
  const oa = p(a);
  const ob = p(b);
  return isSome(oa) && isSome(ob) ? f(oa.value, ob.value) : fallback;
};
