import chroma from "chroma-js";
import p5 from "p5";
import {
  Grid,
  hasLinkAtEast,
  hasLinkAtNorth,
  hasLinkAtSouth,
  rows,
  shortestPath,
} from "./grid";
import { hasSouthNeighbor, hasWestNeighbor } from "./neighbors";
import { Position } from "./plane";
import { replicate } from "./replicate";

export const toConsole = (g: Grid, goal: Position): void => {
  let output = `\n+${replicate(g.dimensions[1])("---+").join("")}\n`;

  const sp = shortestPath(g, goal);
  const distanceForIndex = (i: number): string => (sp.includes(i) ? " x " : "   ");

  rows(g)
    .reverse()
    .forEach((row) => {
      let top = "|";
      let bottom = "+";
      row.forEach((cell) => {
        const body = distanceForIndex(cell.index);
        const eastBoundary = hasLinkAtEast(g, cell) ? " " : "|";
        top += body + eastBoundary;
        const southBoundary = hasLinkAtSouth(g, cell) ? "   " : "---";
        bottom += southBoundary + "+";
      });
      output += top + "\n" + bottom + "\n";
    });

  console.log(output);
};

export const toP5 = (p: p5) => (offset: Position, g: Grid, goal: Position): void => {
  const cellSize = 20;
  const strokeWeight = 10;
  const stroke = 0;
  const [h] = g.dimensions;
  const [offY, offX] = offset;
  const height = h - 1;
  const sp = shortestPath(g, goal);
  const [cr, cg, cb] = chroma("gold").rgb();

  p.strokeWeight(0);
  p.fill(cr, cg, cb);

  for (const cell of g.cells) {
    if (!sp.includes(cell.index)) continue;
    const [r, col] = cell.pos;
    const row = height - r;
    const x1 = col * cellSize + offX;
    const y1 = row * cellSize + offY;
    p.rect(x1, y1, cellSize, cellSize);
  }

  p.stroke(stroke);
  p.strokeWeight(strokeWeight);

  for (const cell of g.cells) {
    const [r, col] = cell.pos;
    const row = height - r;

    const x1 = col * cellSize + offX;
    const x2 = (col + 1) * cellSize + offX;

    const y1 = row * cellSize + offY;
    const y2 = (row + 1) * cellSize + offY;

    if (!hasLinkAtNorth(g, cell)) {
      p.line(x1, y1, x2, y1);
    }

    if (!hasWestNeighbor(cell.neighbors)) {
      p.line(x1, y1, x1, y2);
    }

    if (!hasLinkAtEast(g, cell)) {
      p.line(x2, y1, x2, y2);
    }

    if (!hasSouthNeighbor(cell.neighbors)) {
      p.line(x1, y2, x2, y2);
    }
  }
};
