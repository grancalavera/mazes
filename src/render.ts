import p5 from "p5";
import {
  Grid,
  hasLinkAtEast,
  hasLinkAtNorth,
  hasLinkAtSouth,
  rows,
  distances,
} from "./grid";
import { hasSouthNeighbor, hasWestNeighbor } from "./neighbors";
import { Position } from "./plane";
import { replicate } from "./replicate";
import { isNone } from "./option";

export const toConsole = (g: Grid): void => {
  let output = `+${replicate(g.dimensions[1])("---+").join("")}\n`;
  const ds = distances(g, [0, 0]);

  const dForI = (i: number): string => {
    const d = isNone(ds) ? "" : ds.value[i];
    return d.toString().padEnd(3, " ");
  };

  rows(g)
    .reverse()
    .forEach((row) => {
      let top = "|";
      let bottom = "+";
      row.forEach((cell) => {
        const body = dForI(cell.index);
        const eastBoundary = hasLinkAtEast(g, cell) ? " " : "|";
        top += body + eastBoundary;
        const southBoundary = hasLinkAtSouth(g, cell) ? "   " : "---";
        bottom += southBoundary + "+";
      });
      output += top + "\n" + bottom + "\n";
    });

  console.log(output);
};

export const toP5 = (p: p5) => (offset: Position, m: Grid): void => {
  const cellSize = 20;
  const strokeWeight = 10;
  const stroke = 0;
  const [h] = m.dimensions;
  const [offY, offX] = offset;
  const height = h - 1;

  p.stroke(stroke);
  p.strokeWeight(strokeWeight);

  for (const cell of m.cells) {
    const [r, col] = cell.pos;
    const row = height - r;

    const x1 = col * cellSize + offX;
    const x2 = (col + 1) * cellSize + offX;

    const y1 = row * cellSize + offY;
    const y2 = (row + 1) * cellSize + offY;

    if (!hasLinkAtNorth(m, cell)) {
      p.line(x1, y1, x2, y1);
    }

    if (!hasWestNeighbor(cell.neighbors)) {
      p.line(x1, y1, x1, y2);
    }

    if (!hasLinkAtEast(m, cell)) {
      p.line(x2, y1, x2, y2);
    }

    if (!hasSouthNeighbor(cell.neighbors)) {
      p.line(x1, y2, x2, y2);
    }
  }
};
