import { Cell } from "./grid";
import { hasEastNeighbor, hasNorthNeighbor } from "./neighbors";

export type CellAction = "CarveEast" | "CarveNorth" | "FlipCoin" | "Done";

export function cellAction(cell: Cell): CellAction {
  const { neighbors } = cell;
  if (hasEastNeighbor(neighbors) && hasNorthNeighbor(neighbors)) {
    return "FlipCoin";
  }

  if (!hasEastNeighbor(neighbors) && hasNorthNeighbor(neighbors)) {
    return "CarveNorth";
  }

  if (hasEastNeighbor(neighbors)) {
    return "CarveEast";
  }

  return "Done";
}
