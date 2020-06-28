import { fromSome, isSome, none, Option, some } from "./option";
import * as p from "./plane";

const d: p.Dimensions = [2, 1];

interface FromIndexScenario {
  name: string;
  dimensions: p.Dimensions;
  input: p.Index;
  expected: Option<p.Position>;
}

interface ToIndexScenario {
  name: string;
  dimensions: p.Dimensions;
  input: p.Position;
  expected: Option<p.Index>;
}

const fromIndexScenarios: FromIndexScenario[] = [
  {
    name: "2x1 from index 0",
    dimensions: d,
    input: 0,
    expected: some([0, 0]),
  },
  {
    name: "2x1 from index 1",
    dimensions: d,
    input: 1,
    expected: some([1, 0]),
  },
  { name: "2x1 from index -1", dimensions: d, input: -1, expected: none },
  { name: "2x1 from index 2", dimensions: d, input: 2, expected: none },
  { name: "0x0 from index 0", dimensions: [0, 0], input: 0, expected: none },
  { name: "-1x0 from index 0", dimensions: [-1, 0], input: 0, expected: none },
  { name: "0x-1 from index 0", dimensions: [0, -1], input: 0, expected: none },
];

const toIndexScenarios: ToIndexScenario[] = [
  {
    name: "2x1 to index (0,0)",
    dimensions: d,
    input: [0, 0],
    expected: some(0),
  },
  {
    name: "2x1 to index (1,0)",
    dimensions: d,
    input: [1, 0],
    expected: some(1),
  },
  {
    name: "2x1 to index (-1,0)",
    dimensions: d,
    input: [-1, 0],
    expected: none,
  },
  {
    name: "2x1 to index (2,0)",
    dimensions: d,
    input: [2, 0],
    expected: none,
  },
  {
    name: "2x1 to index (0,-1)",
    dimensions: d,
    input: [0, -1],
    expected: none,
  },
  {
    name: "2x1 to index (0,2)",
    dimensions: d,
    input: [0, 2],
    expected: none,
  },
];

describe.each(fromIndexScenarios)("positionFromIndex", (scenario) => {
  const { name, input, expected } = scenario;
  const actual = p.positionFromIndex(scenario.dimensions)(input);

  describe(name, () => {
    it("application", () => {
      expect(actual).toEqual(expected);
    });

    if (isSome(expected)) {
      it("isomorphism", () => {
        const isoActual = p.positionToIndex(d)(fromSome(actual));
        expect(fromSome(isoActual)).toEqual(input);
      });
    }
  });
});

describe.each(toIndexScenarios)("positionToIndex", (scenario) => {
  const { name, dimensions, input, expected } = scenario;
  const actual = p.positionToIndex(dimensions)(input);

  describe(name, () => {
    it("application", () => {
      expect(actual).toEqual(expected);
    });

    if (isSome(expected)) {
      it("isomorphism", () => {
        const isoActual = p.positionFromIndex(dimensions)(fromSome(actual));
        expect(fromSome(isoActual)).toEqual(input);
      });
    }
  });
});
