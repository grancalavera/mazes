export type Option<T> = Some<T> | None;
type Some<T> = { readonly kind: "Some"; readonly value: T };
type None = { readonly kind: "None" };

export const some = <T>(value: T): Option<T> => ({ kind: "Some", value });
export const none: Option<never> = { kind: "None" };
export const isSome = <T>(m: Option<T>): m is Some<T> => m.kind === "Some";
export const isNone = (m: Option<unknown>): m is None => m.kind === "None";

export const fromSome = <T>(m: Option<T>): T => {
  if (isSome(m)) {
    return m.value;
  }

  throw new Error("None is not Some<T>");
};

export const map = <T, U>(f: (t: T) => U) => (m: Option<T>): Option<U> =>
  isSome(m) ? some(f(m.value)) : none;
