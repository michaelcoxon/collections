import { IEnumerable } from "./Interfaces/IEnumerable";

export type IEnumerableOrArray<T> = T[] | IEnumerable<T>;
export type KeySelector<T, K extends keyof T> = (propertyName: K) => T[K];
export type KeyValuePair<TKey, TValue> = { readonly key: TKey; value: TValue; };