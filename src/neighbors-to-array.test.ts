import * as n from "./neighbors";
import * as p from "./plane";
import { some, none } from "./option";

interface Scenario {
  name: string;
  input: n.Neighbors;
  expected: p.Position[];
}

const scenarios: Scenario[] = [
  {
    name: "neighbors in all directions",
    input: {
      north: some([0, 0]),
      east: some([1, 1]),
      south: some([2, 2]),
      west: some([3, 3]),
    },
    expected: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
  },
  {
    name: "neighbors in some directions",
    input: {
      north: some([0, 0]),
      east: none,
      south: some([2, 2]),
      west: none,
    },
    expected: [
      [0, 0],
      [2, 2],
    ],
  },
];

describe.each(scenarios)("Neighbors.toList", (scenario) => {
  const { name, input, expected } = scenario;
  const actual = n.toArray(input);
  it(name, () => {
    expect(actual).toEqual(expected);
  });
});
