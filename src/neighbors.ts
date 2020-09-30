import { assertNever } from "./assert-never";
import { fromSome, isSome, none, Option, some } from "./option";
import { Dimensions, Index, Position, positionToIndex } from "./plane";

//   N   2
// W x E 1
//   S   0
// 0 1 2

export type Direction = "north" | "east" | "south" | "west";

export interface Neighbors {
  readonly north: Option<Neighbor>;
  readonly east: Option<Neighbor>;
  readonly south: Option<Neighbor>;
  readonly west: Option<Neighbor>;
}

export type Neighbor = [Position, Index];

export const empty: Neighbors = {
  east: none,
  north: none,
  south: none,
  west: none,
};

export const toArray = (n: Neighbors): Neighbor[] =>
  (Object.values(n) as Option<Neighbor>[]).filter(isSome).map(fromSome);

export const neighbors = (d: Dimensions) => (p: Position): Neighbors => {
  const neighborAt = findNeighbor(d, p);
  return {
    north: neighborAt(walkNorth),
    east: neighborAt(walkEast),
    south: neighborAt(walkSouth),
    west: neighborAt(walkWest),
  };
};

const findNeighbor = (d: Dimensions, p: Position) => (walkTo: Walk): Option<Neighbor> => {
  const candidate = walkTo(p);
  const index = positionToIndex(d)(candidate);
  // is enough by checking the position candidate has an index within the given dimensions
  // if it doesn't, it means we're out of bounds and there is no neighbor in the direction
  // we're walking
  return isSome(index) ? some([candidate, index.value]) : none;
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
      assertNever(d);
  }
};

const walkNorth: Walk = walk("north");
const walkSouth: Walk = walk("south");
const walkEast: Walk = walk("east");
const walkWest: Walk = walk("west");
