import { none, Option, some } from "./option";

export type Position = [Row, Col];
export type Dimensions = [RowCount, ColCount];
export type Index = number;

type Row = number;
type Col = number;
type RowCount = number;
type ColCount = number;

type PositionFromIndex = (dimensions: Dimensions) => (index: Index) => Option<Position>;
type PositionToIndex = (dimensions: Dimensions) => (position: Position) => Option<Index>;

// https://stackoverflow.com/questions/5991837/row-major-order-indices
export const positionFromIndex: PositionFromIndex = (d) => (i) => {
  if (!isValidIndex(d)(i)) return none;
  const [_, colCount] = d;
  const row = Math.floor(i / colCount);
  const col = i - row * colCount;
  return some([row, col]);
};

// https://stackoverflow.com/questions/5991837/row-major-order-indices
export const positionToIndex: PositionToIndex = (d) => (p) => {
  if (!isValidPosition(d)(p)) return none;
  const [_, colCount] = d;
  const [row, col] = p;
  return some(col + row * colCount);
};

const isValidIndex = ([rowCount, colCount]: Dimensions) => (i: Index): boolean =>
  0 <= i && i < rowCount * colCount;

export const isValidPosition = ([rowCount, colCount]: Dimensions) => ([
  row,
  col,
]: Position): boolean => 0 <= row && row < rowCount && 0 <= col && col < colCount;
