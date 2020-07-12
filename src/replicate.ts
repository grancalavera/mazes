export const replicate = (n: number) => <T>(x: T): T[] =>
  [...Array(n)].map(() => x);
