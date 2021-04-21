import { IEnumerable } from "./IEnumerable";

export interface IEnumerableGroup<T, TKey> extends IEnumerable<T>
{
    readonly key: TKey
}
