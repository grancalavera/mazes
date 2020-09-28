import p5 from "p5";
import * as g from "./grid";
import { hasSouthNeighbor, hasWestNeighbor } from "./neighbors";
import { Position } from "./plane";
import { chooseFirst, memoryCoin } from "./random";
import { sidewinder } from "./sidewinder";
import { maze2, maze3 } from "./sidewinder-fixtures";

const drawMaze = (p: p5, offset: Position, m: g.Grid): void => {
  const [offY, offX] = offset;
  const cellSize = 20;
  const strokeWeight = 5;
  const stroke = 0;

  p.stroke(stroke);
  p.strokeWeight(strokeWeight);

  for (const cell of m.cells) {
    const [row, col] = cell.pos;
    const x1 = col * cellSize + offX;
    const y1 = row * cellSize + offY;
    const x2 = (col + 1) * cellSize + offX;
    const y2 = (row + 1) * cellSize + offY;

    if (!hasSouthNeighbor(cell.neighbors)) {
      p.line(x1, y1, x2, y1);
    }

    if (!hasWestNeighbor(cell.neighbors)) {
      p.line(x1, y1, x1, y2);
    }

    if (!g.hasLinkAtEast(m, cell)) {
      p.line(x2, y1, x2, y2);
    }

    if (!g.hasLinkAtNorth(m, cell)) {
      p.line(x1, y2, x2, y2);
    }
  }
};

new p5((p: p5) => {
  const m3 = sidewinder(memoryCoin(true, 1), chooseFirst)([5, 5]);
  console.log(g.print(m3));
  console.log(g.print(maze3));

  p.setup = () => p.createCanvas(p.windowWidth, p.windowHeight);

  p.draw = () => {
    drawMaze(p, [20, 20], m3);
    drawMaze(p, [20, 210], maze3);
  };
});
