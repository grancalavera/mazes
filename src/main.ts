import { randomBinaryTree } from "./binary-tree";
console.log(JSON.stringify(randomBinaryTree([4, 4]), null, 2));

const blank = "000000000\n000000000\n000000000\n000000000\n000000000".split("");
const above = "+---+---0\n000000000\n000000000\n000000000\n000000000".split("");
const right = "00000000+\n00000000|\n00000000+\n00000000|\n00000000+".split("");
const _0_0_ = "000000000\n000000000\n000000000\n|00000000\n+---00000".split("");
const _0_1_ = "000000000\n000000000\n000000000\n0000|0000\n0000+---0".split("");
const _1_0_ = "000000000\n|00000000\n*---00000\n000000000\n000000000".split("");
const _1_1_ = "000000000\n0000|0000\n0000*---0\n000000000\n000000000".split("");

const sum = (left: string[], right: string[]): string[] =>
  left.map((l, i) => {
    const r = right[i];
    return r === "0" ? l : r;
  });

const render = (tiles: string[]): string =>
  tiles.map((t) => (t === "0" ? " " : t)).join("");

const aboveAndRight = sum(above, right);
console.log(render(sum(sum(sum(sum(sum(above, right), _0_0_), _0_1_), _1_0_), _1_1_)));
