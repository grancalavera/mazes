import { Dimensions, Position } from "./plane";
import * as n from "./neighbors";
import { none, some } from "./option";

interface Scenario {
  name: string;
  input: [Dimensions, Position];
  expected: n.Neighbors;
}

const scenarios: Scenario[] = [
  {
    name: "1x1 plane: valid plane, empty neighbors",
    input: [
      [1, 1],
      [0, 0],
    ],
    expected: n.empty,
  },
  {
    name: "0x0 plane: invalid plane, empty neighbors",
    input: [
      [0, 0],
      [0, 0],
    ],
    expected: n.empty,
  },
  {
    name: "-1x0 plane: invalid plane, empty neighbors",
    input: [
      [-1, 0],
      [0, 0],
    ],
    expected: n.empty,
  },
  // (1,0,2) (1,1,3)
  // (0,0,0) (0,1,1)
  {
    name: "2x2 plane, neighbors for (0,0)",
    input: [
      [2, 2],
      [0, 0],
    ],
    expected: {
      north: some([[1, 0], 2]),
      east: some([[0, 1], 1]),
      south: none,
      west: none,
    },
  },
  {
    name: "2x2 plane, neighbors for (0,1)",
    input: [
      [2, 2],
      [0, 1],
    ],
    expected: {
      north: some([[1, 1], 3]),
      east: none,
      south: none,
      west: some([[0, 0], 0]),
    },
  },
  {
    name: "2x2 plane, neighbors for (1,0)",
    input: [
      [2, 2],
      [1, 0],
    ],
    expected: {
      north: none,
      east: some([[1, 1], 3]),
      south: some([[0, 0], 0]),
      west: none,
    },
  },
  {
    name: "2x2 plane, neighbors for (1,1)",
    input: [
      [2, 2],
      [1, 1],
    ],
    expected: {
      north: none,
      east: none,
      south: some([[0, 1], 1]),
      west: some([[1, 0], 2]),
    },
  },
  // (2,0,6) (2,1,7) (2,2,8)
  // (1,0,3) (1,1,4) (1,2,5)
  // (0,0,0) (0,1,1) (0,2,2)
  {
    name: "3x3 plane, neighbors for (1,1)",
    input: [
      [3, 3],
      [1, 1],
    ],
    expected: {
      north: some([[2, 1], 7]),
      east: some([[1, 2], 5]),
      south: some([[0, 1], 1]),
      west: some([[1, 0], 3]),
    },
  },
  {
    name: "3x3 plane, neighbors for (1,0)",
    input: [
      [3, 3],
      [1, 0],
    ],
    expected: {
      north: some([[2, 0], 6]),
      east: some([[1, 1], 4]),
      south: some([[0, 0], 0]),
      west: none,
    },
  },
  {
    name: "3x3 plane, neighbors for (1,2)",
    input: [
      [3, 3],
      [1, 2],
    ],
    expected: {
      north: some([[2, 2], 8]),
      east: none,
      south: some([[0, 2], 2]),
      west: some([[1, 1], 4]),
    },
  },
  {
    name: "3x3 plane, neighbors for (0,1)",
    input: [
      [3, 3],
      [0, 1],
    ],
    expected: {
      north: some([[1, 1], 4]),
      east: some([[0, 2], 2]),
      south: none,
      west: some([[0, 0], 0]),
    },
  },
  {
    name: "3x3 plane, neighbors for (2,1)",
    input: [
      [3, 3],
      [2, 1],
    ],
    expected: {
      north: none,
      east: some([[2, 2], 8]),
      south: some([[1, 1], 4]),
      west: some([[2, 0], 6]),
    },
  },
];

describe.each(scenarios)("find neighbors", (scenario) => {
  const {
    name,
    input: [d, p],
    expected,
  } = scenario;

  const actual = n.neighbors(d)(p);

  it(name, () => {
    expect(actual).toEqual(expected);
  });
});
