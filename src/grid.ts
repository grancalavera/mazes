import * as n from "./neighbors";
import { fromSome } from "./option";
import { Dimensions, Position, positionFromIndex } from "./plane";

interface Cell {
  readonly exits: Exits[];
  readonly pos: Position;
  readonly neighbors: n.Neighbors;
}

interface Grid {
  readonly rows: number;
  readonly cols: number;
  readonly cells: Cell[];
}

type Exit = "north" | "south" | "east" | "west";
type Exits = Exit[];
type MakeGrid = (d: Dimensions) => Grid;
type MakeCell = (d: Dimensions) => (p: Position) => Cell;

export const makeGrid: MakeGrid = (d: Dimensions) => {
  const [rows, cols] = d;
  const p = positionFromIndex(d);
  const c = makeCell(d);
  return {
    rows,
    cols,
    cells: Array.from(Array(rows * cols), (_, i) => c(fromSome(p(i)))),
  };
};

const makeCell: MakeCell = (d: Dimensions) => (p) => ({
  pos: p,
  exits: [],
  neighbors: n.neighbors(d)(p),
});

type MapCell = (c: Cell, g: Grid) => Cell;
type MapRow = (r: Cell[], g: Grid) => Cell[];
type MapCells = (f: MapCell) => (g: Grid) => Grid;
type MapRows = (f: MapRow) => (g: Grid) => Grid;
