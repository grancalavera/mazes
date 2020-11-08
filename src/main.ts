import * as render from "./render";
import { randomSidewinder } from "./sidewinder";
const maze = randomSidewinder([40, 40]);
render.toP5(maze);
