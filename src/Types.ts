import { IEnumerable } from "./IEnumerable";

export type IEnumerableOrArray<T> = T[] | IEnumerable<T>;
export type Predicate<T> = (item: T) => boolean;
export type Selector<T, TReturn> = (item: T) => TReturn;
export type KeySelector<T, K extends keyof T> = (propertyName: K) => T[K];
