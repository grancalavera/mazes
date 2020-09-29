import * as g from "./grid";
import { hasEastNeighbor, hasNorthNeighbor } from "./neighbors";

export type Action = "CarveNorth" | "CarveEast" | "DoNothing" | "FlipCoin";

export function cellAction(cell: g.Cell): Action {
  const { neighbors } = cell;
  if (hasEastNeighbor(neighbors) && hasNorthNeighbor(neighbors)) {
    return "FlipCoin";
  }

  if (hasNorthNeighbor(neighbors)) {
    return "CarveNorth";
  }

  if (hasEastNeighbor(neighbors)) {
    return "CarveEast";
  }

  return "DoNothing";
}
