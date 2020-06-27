export type Maybe<T> = Some<T> | None;
type Some<T> = { readonly kind: "Some"; readonly value: T };
type None = { readonly kind: "None" };

export const some = <T>(value: T): Maybe<T> => ({ kind: "Some", value });
export const none: Maybe<never> = { kind: "None" };
export const isSome = <T>(m: Maybe<T>): m is Some<T> => m.kind === "Some";
export const isNone = (m: Maybe<unknown>): m is None => m.kind === "None";

export const fromSome = <T>(m: Maybe<T>): T => {
  if (isSome(m)) {
    return m.value;
  }

  throw new Error("None is not Some<T>");
};

export const map = <T, U>(f: (t: T) => U) => (m: Maybe<T>): Maybe<U> =>
  isSome(m) ? some(f(m.value)) : none;
