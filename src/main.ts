import { randomBinaryTree } from "./binary-tree";
import { print } from "./grid";

setInterval(() => {
  const myMaze = randomBinaryTree([15, 15]);
  console.clear();
  console.log(print(myMaze));
}, 500);
