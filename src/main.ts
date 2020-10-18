import { Position } from "./plane";
import * as render from "./render";
import { randomSidewinder } from "./sidewinder";

const goal: Position = [19, 19];
const maze = randomSidewinder([20, 20]);

render.toP5(maze, goal)
render.toConsole(maze, goal)
