import { Grid } from "./grid";
import { toArray } from "./neighbors";
import * as render from "./render";
import { maze1, maze3 } from "./sidewinder-fixtures";
import "./render-four-of-each";
// https://jelv.is/blog/Generating-Mazes-with-Inductive-Graphs/

render.toConsole(maze1);

const f = (g: Grid, i: number, d: number): [number, number][] => {
  const cell = g.cells[i];
  return toArray(cell.neighbors).map(([pos, i]) => [i, d + 1]);
};

console.log(f(maze3, 0, 0));
