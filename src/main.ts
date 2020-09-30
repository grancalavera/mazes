import { distances } from "./grid";
import * as render from "./render";
import { maze1 } from "./sidewinder-fixtures";
import "./render-four-of-each";

render.toConsole(maze1);
console.log(JSON.stringify(distances(maze1, [0, 0]), null, 2));
