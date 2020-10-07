import { none, some } from "./option";
import { addLink, distances, merge, shortestPath, isValid } from "./tiny-graph";

describe("tiny graph", () => {
  it("valid 1: self links aren't valid", () => {
    const g = { 0: [0] };
    const actual = isValid(g);
    expect(actual).toEqual(false);
  });

  it("valid 2: must contain at least 1 node", () => {
    const g = {};
    const actual = isValid(g);
    expect(actual).toEqual(false);
  });

  it("valid 3: trivial graph", () => {
    const g = { 0: [] };
    const actual = isValid(g);
    expect(actual).toEqual(true);
  });

  it("merge 1", () => {
    const g1 = { 0: [] };
    const g2 = { 0: [] };
    expect(merge(g1, g2)).toEqual({ 0: [] });
  });

  it("merge 2", () => {
    const g1 = { 0: [] };
    const g2 = { 1: [] };
    expect(merge(g1, g2)).toEqual({ 0: [], 1: [] });
  });

  it("merge 3", () => {
    const g1 = { 0: [1], 1: [0] };
    const g2 = { 0: [], 1: [] };
    expect(merge(g1, g2)).toEqual({ 0: [1], 1: [0] });
  });

  it("merge 4", () => {
    const g1 = { 0: [1], 1: [0] };
    const g2 = { 0: [2], 1: [], 2: [0] };
    expect(merge(g1, g2)).toEqual({ 0: [1, 2], 1: [0], 2: [0] });
  });

  it("merge 5: sort on merge", () => {
    const g1 = { 0: [2], 1: [], 2: [0] };
    const g2 = { 0: [1], 1: [0] };
    expect(merge(g1, g2)).toEqual({ 0: [1, 2], 1: [0], 2: [0] });
  });

  it("add link: both nodes must exist 1", () => {
    const g = {};
    const n1 = 0;
    const n2 = 1;
    const actual = addLink(g, n1, n2);
    expect(actual).toEqual(none);
  });

  it("self links are not allowed,", () => {
    const g = { 0: [] };
    const n1 = 0;
    const n2 = 0;
    const actual = addLink(g, n1, n2);
    expect(actual).toEqual(none);
  });

  it("add link: both nodes must exist 2", () => {
    const g = { 0: [] };
    const n1 = 0;
    const n2 = 1;
    const actual = addLink(g, n1, n2);
    expect(actual).toEqual(none);
  });

  it("add link: both nodes must exist 3", () => {
    const g = { 1: [] };
    const n1 = 0;
    const n2 = 1;
    const actual = addLink(g, n1, n2);
    expect(actual).toEqual(none);
  });

  it("add link 1", () => {
    const g = { 0: [], 1: [] };
    const n1 = 0;
    const n2 = 1;
    const actual = addLink(g, n1, n2);
    expect(actual).toEqual(some({ 0: [1], 1: [0] }));
  });

  it("add link 2", () => {
    const g = { 0: [1], 1: [0], 2: [] };
    const n1 = 0;
    const n2 = 2;
    const actual = addLink(g, n1, n2);
    expect(actual).toEqual(some({ 0: [1, 2], 1: [0], 2: [0] }));
  });

  it("distances 1", () => {
    const g = { 0: [1], 1: [0] };
    const actual = distances(g, 2);
    expect(actual).toEqual({});
  });

  it("distances 2", () => {
    const g = { 0: [1], 1: [0, 3], 2: [3], 3: [1, 2] };
    const actual = distances(g, 0);
    expect(actual).toEqual({ 0: 0, 1: 1, 2: 3, 3: 2 });
  });

  it("distances 3", () => {
    const g = {
      0: [1],
      1: [0, 2],
      2: [1, 5],
      3: [4],
      4: [3, 5],
      5: [2, 4, 8],
      6: [7],
      7: [6, 8],
      8: [5, 7],
    };
    const actual = distances(g, 0);
    expect(actual).toEqual({ 0: 0, 1: 1, 2: 2, 3: 5, 4: 4, 5: 3, 6: 6, 7: 5, 8: 4 });
  });

  it("distances 4", () => {
    const g = {
      0: [1],
      1: [0, 2],
      2: [1, 5],
      3: [4],
      4: [3, 5],
      5: [2, 4, 8],
      6: [7],
      7: [6, 8],
      8: [5, 7],
    };
    const actual = distances(g, 3);
    expect(actual).toEqual({ 0: 5, 1: 4, 2: 3, 3: 0, 4: 1, 5: 2, 6: 5, 7: 4, 8: 3 });
  });

  it("shortest path 1", () => {
    const g = {};
    const actual = shortestPath(g, 0);
    expect(actual).toEqual([]);
  });

  it("shortest path 2", () => {
    const g = { 0: [] };
    const actual = shortestPath(g, 0);
    expect(actual).toEqual([]);
  });

  it("shortest path 3", () => {
    // this means any function that takes a TinyGraph will need to validate the graph
    // well, actually not THIS but the restriction to not allow self links
    const g = { 0: [0] };
    const actual = shortestPath(g, 0);
    expect(actual).toEqual([]);
  });

  xit("shortest path 4", () => {
    const g = { 0: [1], 1: [0] };
    const actual = shortestPath(g, 1);
    expect(actual).toEqual([0, 1]);
  });
});
