import { none, Option, some, isSome, fromSome } from "./option";
import { Dimensions, isValidPosition, Position } from "./plane";

//   N   2
// W x E 1
//   S   0
// 0 1 2

export type Direction = "north" | "east" | "south" | "west";

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

export const toArray = (n: Neighbors): Position[] =>
  (Object.values(n) as Option<Position>[]).filter(isSome).map(fromSome);

export const neighbors = (d: Dimensions) => (p: Position): Neighbors => {
  const neighborAt = findNeighborAt(d, p);
  return {
    north: neighborAt(walkNorth),
    east: neighborAt(walkEast),
    south: neighborAt(walkSouth),
    west: neighborAt(walkWest),
  };
};

const findNeighborAt = (d: Dimensions, p: Position) => (walk: Walk): Option<Position> => {
  const candidate = walk(p);
  return isValidPosition(d)(candidate) ? some(candidate) : none;
};

const hasNeighborAt = (d: Direction) => (n: Neighbors) => isSome(n[d]);
export const hasNorthNeighbor = hasNeighborAt("north");
export const hasEastNeighbor = hasNeighborAt("east");
export const hasSouthNeighbor = hasNeighborAt("south");
export const hasWestNeighbor = hasNeighborAt("west");

type Walk = (p: Position) => Position;

export const walk = (d: Direction) => ([row, col]: Position): Position => {
  switch (d) {
    case "east":
      return [row, col + 1];
    case "north":
      return [row + 1, col];
    case "south":
      return [row - 1, col];
    case "west":
      return [row, col - 1];
    default:
      const never: never = d;
      throw new Error(`unknown direction ${never}`);
  }
};

const walkNorth: Walk = walk("north");
const walkSouth: Walk = walk("south");
const walkEast: Walk = walk("east");
const walkWest: Walk = walk("west");
