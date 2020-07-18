/*
We want to capture the result of n subsequent coin flips, starting from
some boolean value x and remembering such value for y coin flips, and then
alternating to the opposite boolean value, and  finally repeating the sequence

For example:
Start: true
Remember: 2
Flip: 4 times
Result:
- true
- true
- false
- false
*/

import { isSome, none, Option, some } from "./option";
import { memoryCoin, coinFlip } from "./random";
import { replicate } from "./replicate";

interface Scenario {
  input: {
    remember: number;
    start: boolean;
    totalFlip: number;
  };
  name: string;
  expected: Option<boolean[]>;
}

const scenarios: Scenario[] = [
  {
    name: "Remember zero true",
    input: {
      remember: 0,
      start: true,
      totalFlip: 2,
    },
    expected: some([true, true]),
  },
  {
    name: "Remember one true",
    input: {
      remember: 1,
      start: true,
      totalFlip: 6,
    },
    expected: some([true, false, true, false, true, false]),
  },
  {
    name: "Remember two truth",
    input: {
      remember: 2,
      start: true,
      totalFlip: 4,
    },
    expected: some([true, true, false, false]),
  },
  {
    name: "It should throw for negative numbers",
    input: {
      remember: -1,
      start: true,
      totalFlip: 1,
    },
    expected: none,
  },
  {
    name: "What are we supposed to do with decimal values?",
    input: {
      remember: 2.1,
      start: true,
      totalFlip: 4,
    },
    expected: some([true, true, false, false]),
  },
  {
    name: "What are we supposed to do with decimal values?",
    input: {
      remember: 2.9,
      start: true,
      totalFlip: 4,
    },
    expected: some([true, true, false, false]),
  },
];

describe.each(scenarios)("Memory Coin", (scenario) => {
  const { name, input, expected } = scenario;

  it(name, () => {
    const { remember, start, totalFlip } = input;
    const coin = memoryCoin(start, remember);
    if (isSome(expected)) {
      const actual = some(replicate(totalFlip)(coin).map((x) => x()));
      expect(actual).toEqual(expected);
    } else {
      expect(() => coin()).toThrow();
    }
  });
});
