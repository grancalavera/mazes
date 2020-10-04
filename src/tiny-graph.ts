import { none, Option, some } from "./option";

type TinyGraph = Record<number, readonly TinyNode[] | undefined>;
type TinyDistances = Record<number, number | undefined>;
type TinyNode = number;

type Merge = (g1: TinyGraph, g2: TinyGraph) => TinyGraph;
type AddLink = (g: TinyGraph, n1: TinyNode, n2: TinyNode) => Option<TinyGraph>;
type Distances = (g: TinyGraph, n: TinyNode) => TinyDistances;

export const merge: Merge = (g1, g2) =>
  Object.fromEntries(
    mergeKeys(g1, g2).map((k) => {
      const l = g1[k] ?? [];
      const r = g2[k] ?? [];
      return [k, [...l, ...r].sort()] as const;
    })
  );

export const addLink: AddLink = (g, n1, n2) => {
  const h = hasNode(g);
  const l = link(g);
  return h(n1) && h(n2) ? some({ ...g, [n1]: l(n1, n2), [n2]: l(n2, n1) }) : none;
};

export const distances: Distances = (g, n) =>
  hasNode(g)(n) ? Object.fromEntries(distancesRecursive(g, [n], 0, [])) : {};

const link = (g: TinyGraph) => (n1: TinyNode, n2: TinyNode): readonly TinyNode[] => [
  ...new Set([...(g[n1] ?? []), n2]),
];

const hasNode = (g: TinyGraph) => (n: TinyNode): boolean => !!g[n];
const keys = (g: TinyGraph) => Object.keys(g).map((k) => parseInt(k));
const mergeKeys = (g1: TinyGraph, g2: TinyGraph): number[] => [
  ...new Set([...keys(g1), ...keys(g2)]),
];

const distancesRecursive = (
  g: TinyGraph,
  frontier: TinyNode[],
  distance: number,
  seen: TinyNode[]
): (readonly [TinyNode, number])[] => {
  const notSeen = (n: TinyNode) => (g[n] ?? []).filter((m) => !seen.includes(m));
  return [
    ...frontier.map((n) => [n, distance] as const),
    ...frontier.flatMap((n) =>
      distancesRecursive(g, notSeen(n), distance + 1, [...seen, ...frontier])
    ),
  ];
};
