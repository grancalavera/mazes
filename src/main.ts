import { distances } from "./grid";
import { maze3 } from "./sidewinder-fixtures";
import * as render from "./render";

render.toConsole(maze3);
console.log(JSON.stringify(distances(maze3, [0, 0]), null, 2));
