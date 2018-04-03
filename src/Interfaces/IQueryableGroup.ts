import { IQueryable } from "./IQueryable";

export interface IQueryableGroup<T, TKey> extends IQueryable<T>
{
    readonly key: TKey
}
