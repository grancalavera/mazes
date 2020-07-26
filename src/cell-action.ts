import * as g from "./grid";
import * as n from "./neighbors";

export type Action = "CarveNorth" | "CarveEast" | "DoNothing" | "FlipCoin";

export function cellAction(cell: g.Cell): Action {
  const { neighbors } = cell;
  if (n.hasEastNeighbor(neighbors) && n.hasNorthNeighbor(neighbors)) {
    return "FlipCoin";
  }

  if (!n.hasEastNeighbor(neighbors) && n.hasNorthNeighbor(neighbors)) {
    return "CarveNorth";
  }
  if (n.hasEastNeighbor(neighbors) && !n.hasNorthNeighbor(neighbors)) {
    return "CarveEast";
  }

  return "DoNothing";
}
