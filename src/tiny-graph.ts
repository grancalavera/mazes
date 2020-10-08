import { none, Option, some } from "./option";

export type TinyGraph = Record<number, readonly TinyNode[] | undefined>;
export type TinyDistances = Record<number, number | undefined>;
type TinyNode = number;

type Merge = (g1: TinyGraph, g2: TinyGraph) => TinyGraph;
type AddLink = (g: TinyGraph, n1: TinyNode, n2: TinyNode) => Option<TinyGraph>;
type ShortestPath = (g: TinyGraph, goal: TinyNode) => readonly TinyNode[];
type Distances = (g: TinyGraph, n: TinyNode) => TinyDistances;

export const isValid = (g: TinyGraph): boolean => {
  const ks = keys(g);
  if (ks.length < 1) return false;

  const hasSelfLinks = ks.some((k) => (g[k] ?? []).some((n) => n === k));
  if (hasSelfLinks) return false;

  return true;
};

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
  const isSelfLink = n1 === n2;
  return h(n1) && h(n2) && !isSelfLink
    ? some({ ...g, [n1]: l(n1, n2), [n2]: l(n2, n1) })
    : none;
};

export const distances: Distances = (g, n) => {
  const rec = (
    frontier: TinyNode[],
    distance: number,
    seen: TinyNode[]
  ): (readonly [TinyNode, number])[] => {
    const notSeen = (n: TinyNode) => (g[n] ?? []).filter((m) => !seen.includes(m));
    return [
      ...frontier.map((n) => [n, distance] as const),
      ...frontier.flatMap((n) => rec(notSeen(n), distance + 1, [...seen, ...frontier])),
    ];
  };

  return hasNode(g)(n) ? Object.fromEntries(rec([n], 0, [])) : {};
};

export const shortestPath: ShortestPath = (g, goal) => {
  if (!isValid(g)) return [];
  if (!hasNode(g)(goal)) return [];
  const far = Number.POSITIVE_INFINITY;
  const ds = distances(g, 0);
  const d = (n: TinyNode): number => ds[n] ?? far;

  const rec = (current: TinyNode, path: TinyNode[]): readonly TinyNode[] => {
    if (current === 0) return path;
    const neighbors = g[current] ?? [];
    if (neighbors.length === 0) return path;
    const c = neighbors.reduce((n1, n2) => (d(n1) < d(n2) ? n1 : n2), far);
    const p = [c, ...path];
    return rec(c, p);
  };

  return rec(goal, [goal]);
};

const link = (g: TinyGraph) => (n1: TinyNode, n2: TinyNode): readonly TinyNode[] => [
  ...new Set([...(g[n1] ?? []), n2]),
];

const hasNode = (g: TinyGraph) => (n: TinyNode): boolean => !!g[n];
const keys = (g: TinyGraph) => Object.keys(g).map((k) => parseInt(k));
const mergeKeys = (g1: TinyGraph, g2: TinyGraph): number[] => [
  ...new Set([...keys(g1), ...keys(g2)]),
];
