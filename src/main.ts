import p5 from "p5";
import * as render from "./render";
import { randomSidewinder } from "./sidewinder";

const m = randomSidewinder([30, 30]);
render.toConsole(m);

new p5((p: p5) => {
  const d = render.toP5(p);

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    d([20, 20], m);
  };
});
