import { distances } from "./grid";
import * as render from "./render";
import { maze1 } from "./sidewinder-fixtures";

// https://jelv.is/blog/Generating-Mazes-with-Inductive-Graphs/

render.toConsole(maze1);
console.log(JSON.stringify(distances(maze1, [0, 0]), null, 2));
// console.log(links(maze3, [0, 0]));
