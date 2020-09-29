import p5 from "p5";
import { Grid, hasLinkAtEast, hasLinkAtNorth } from "./grid";
import { hasSouthNeighbor, hasWestNeighbor } from "./neighbors";
import { Position } from "./plane";
import { randomSidewinder } from "./sidewinder";
import { randomBinaryTree } from "./binary-tree";

const drawMaze = (p: p5) => (offset: Position, m: Grid): void => {
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

new p5((p: p5) => {
  const d = drawMaze(p);
  let elapsedFrames = 0;
  let m1: Grid;
  let m2: Grid;

  const frequency = 1;
  const frameRate = 1;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(frameRate);
  };

  p.draw = () => {
    p.clear();

    if (elapsedFrames % frequency === 0) {
      m1 = randomBinaryTree([20, 40]);
      m2 = randomSidewinder([20, 40]);
    }

    d([20, 10], m1);
    d([460, 10], m2);

    p.strokeWeight(1);
    p.text("binary tree", 10, 10);
    p.text("sidewinder", 10, 450);

    elapsedFrames++;
  };
});
