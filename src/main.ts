import * as assert from "assert";

interface Cell {
  readonly exits: Exits[];
  readonly pos: Pos;
}

interface Grid {
  readonly rows: number;
  readonly cols: number;
  readonly cells: Cell[];
}

interface Pos {
  readonly row: Row;
  readonly col: Col;
}

type Row = number;
type Col = number;
type Exit = "north" | "south" | "east" | "west";
type Exits = Exit[];

type Neighbors = (grid: Grid, cell: Cell) => Cell[];
type Linked = (grid: Grid, c1: Cell, c2: Cell) => boolean;
type MakeGrid = (rows: number, cols: number) => Grid;
type MakeCell = (pos: Pos) => Cell;

type Maybe<T> = Some<T> | None;
type Some<T> = { readonly kind: "Some"; readonly value: T };
type None = { readonly kind: "None" };

const some = <T>(value: T): Maybe<T> => ({ kind: "Some", value });
const none: Maybe<never> = { kind: "None" };
const isSome = <T>(m: Maybe<T>): m is Some<T> => m.kind === "Some";
const isNone = (m: Maybe<unknown>): m is None => m.kind === "None";

const makeGrid: MakeGrid = (rows, cols) => {
  const p = indexToPos(rows, cols);
  return {
    rows,
    cols,
    cells: Array.from(Array(rows * cols), (_, i) => makeCell(fromSome(p(i)))),
  };
};

const makeCell: MakeCell = (pos) => ({ pos, exits: [] });

// https://stackoverflow.com/questions/5991837/row-major-order-indices
const indexToPos = (rows: number, cols: number) => (i: number): Maybe<Pos> => {
  if (i < 0 || rows * cols <= i) return none;
  const row = Math.floor(i / cols);
  const col = i - row * cols;
  return some({ row, col });
};

// https://stackoverflow.com/questions/5991837/row-major-order-indices
const posToIndex = (rows: number, cols: number) => ({ row, col }: Pos): Maybe<number> => {
  if (row < 0 || rows <= row || col < 0 || cols <= col) return none;
  return some(col + row * cols);
};

const fromSome = <T>(m: Maybe<T>): T => {
  if (isSome(m)) {
    return m.value;
  }

  throw new Error("None is not Some<T>");
};

assert.deepStrictEqual(
  indexToPos(2, 1)(0),
  some<Pos>({ row: 0, col: 0 })
);

assert.deepStrictEqual(
  indexToPos(2, 1)(1),
  some<Pos>({ row: 1, col: 0 })
);

assert.deepStrictEqual(indexToPos(2, 1)(-1), none);
assert.deepStrictEqual(indexToPos(2, 1)(2), none);

assert.deepStrictEqual(posToIndex(2, 1)({ row: 0, col: 0 }), some(0));
assert.deepStrictEqual(posToIndex(2, 1)({ row: 1, col: 0 }), some(1));

assert.deepStrictEqual(posToIndex(2, 1)({ row: -1, col: 0 }), none);
assert.deepStrictEqual(posToIndex(2, 1)({ row: 2, col: 0 }), none);

assert.deepStrictEqual(posToIndex(2, 1)({ row: 0, col: -1 }), none);
assert.deepStrictEqual(posToIndex(2, 1)({ row: 0, col: 1 }), none);

console.log(JSON.stringify(makeGrid(2, 1), null, 2));
