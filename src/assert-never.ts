export function assertNever(never: never): never {
  console.error("unexpected value", never);
  return never;
}
