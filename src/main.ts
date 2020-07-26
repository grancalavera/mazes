import * as g from "./grid";
import * as sw from "./sidewinder";
import * as r from "./random";

const coin = r.memoryCoin(true, 1);
const sidewinder1 = sw.sidewinder(coin, r.chooseFirst);
const sidewinder2 = sw.sidewinder(coin, r.chooseLast);

import { maze1, maze2 } from "./sidewinder-fixtures";

console.log(g.print(maze1));
console.log(g.print(sidewinder1([4, 4])));
console.log("****");
console.log(g.print(maze2));
console.log(g.print(sidewinder2([4, 4])));
