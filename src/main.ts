import p5 from "p5";
import { Dimensions, Position } from "./plane";
import * as render from "./render";
import { randomSidewinder } from "./sidewinder";

const dimensions: Dimensions = [40, 40];
const goal: Position = [39, 39];
const maze = randomSidewinder(dimensions);

new p5((p: p5) => {
  const d = render.toP5(p);
  p.setup = () => p.createCanvas(p.windowWidth, p.windowHeight);
  p.draw = () => d([20, 20], maze, goal);
});
