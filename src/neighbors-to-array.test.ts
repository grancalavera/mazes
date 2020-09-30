import * as n from "./neighbors";
import { none, some } from "./option";

interface Scenario {
  name: string;
  input: n.Neighbors;
  expected: n.Neighbor[];
}

const scenarios: Scenario[] = [
  {
    name: "neighbors in all directions",
    input: {
      north: some([[0, 0], 0]),
      east: some([[1, 1], 0]),
      south: some([[2, 2], 0]),
      west: some([[3, 3], 0]),
    },
    expected: [
      [[0, 0], 0],
      [[1, 1], 0],
      [[2, 2], 0],
      [[3, 3], 0],
    ],
  },
  {
    name: "neighbors in some directions",
    input: {
      north: some([[0, 0], 0]),
      east: none,
      south: some([[2, 2], 0]),
      west: none,
    },
    expected: [
      [[0, 0], 0],
      [[2, 2], 0],
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
