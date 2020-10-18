import { Position } from "./plane";
import * as render from "./render";
import { randomSidewinder } from "./sidewinder";

const goal: Position = [69, 69];
const maze = randomSidewinder([70, 70]);

render.toP5(maze, goal)
render.toConsole(maze, goal)
