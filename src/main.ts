import p5 from "p5";
import { Grid, hasLinkAtEast, hasLinkAtNorth } from "./grid";
import { hasSouthNeighbor, hasWestNeighbor } from "./neighbors";
import { Position } from "./plane";
import { randomSidewinder } from "./sidewinder";
import { randomBinaryTree } from "./binary-tree";
import * as render from "./render";

new p5((p: p5) => {
  const d = render.toP5(p);
  let elapsedFrames = 0;
  let b1: Grid;
  let b2: Grid;
  let b3: Grid;
  let b4: Grid;

  let s1: Grid;
  let s2: Grid;
  let s3: Grid;
  let s4: Grid;

  const frequency = 1;
  const frameRate = 1;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(frameRate);
  };

  p.draw = () => {
    p.clear();

    if (elapsedFrames % frequency === 0) {
      b1 = randomBinaryTree([10, 10]);
      b2 = randomBinaryTree([10, 10]);
      b3 = randomBinaryTree([10, 10]);
      b4 = randomBinaryTree([10, 10]);

      s1 = randomSidewinder([10, 10]);
      s2 = randomSidewinder([10, 10]);
      s3 = randomSidewinder([10, 10]);
      s4 = randomSidewinder([10, 10]);
    }

    d([20, 10], b1);
    d([20, 240], b2);
    d([250, 10], b3);
    d([250, 240], b4);

    d([500, 10], s1);
    d([500, 240], s2);
    d([730, 10], s3);
    d([730, 240], s4);

    p.strokeWeight(1);
    p.text("binary tree", 10, 10);
    p.text("sidewinder", 10, 490);

    elapsedFrames++;
  };
});
