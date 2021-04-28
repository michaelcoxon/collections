import { IEnumerable } from "./Interfaces/IEnumerable";

/** A type that is either an array or an enumerable */
export type IEnumerableOrArray<T> = T[] | IEnumerable<T>;

/** A function that returns the value of the key */
export type KeySelector<T, K extends keyof T> = (propertyName: K) => T[K];

/** A key and value pair */
export type KeyValuePair<TKey, TValue> = { readonly key: TKey; readonly value: TValue; };