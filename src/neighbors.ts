import { none, Option, some } from "./option";
import { Dimensions, isValidPosition, Position } from "./plane";

//   N   2
// W x E 1
//   S   0
// 0 1 2

export interface Neighbors {
  readonly north: Option<Position>;
  readonly east: Option<Position>;
  readonly south: Option<Position>;
  readonly west: Option<Position>;
}

export const empty: Neighbors = {
  east: none,
  north: none,
  south: none,
  west: none,
};

export const neighbors = (d: Dimensions) => (p: Position): Neighbors => {
  const neighborAt = findNeighborAt(d, p);
  return {
    north: neighborAt(north),
    east: neighborAt(east),
    south: neighborAt(south),
    west: neighborAt(west),
  };
};

const findNeighborAt = (d: Dimensions, p: Position) => (walk: Walk): Option<Position> => {
  const candidate = walk(p);
  return isValidPosition(d)(candidate) ? some(candidate) : none;
};

type Walk = (p: Position) => Position;
const north: Walk = ([row, col]) => [row + 1, col];
const south: Walk = ([row, col]) => [row - 1, col];
const east: Walk = ([row, col]) => [row, col + 1];
const west: Walk = ([row, col]) => [row, col - 1];
