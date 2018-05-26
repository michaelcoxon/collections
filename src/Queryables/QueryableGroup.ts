import { DefaultComparer } from "../Comparers/DefaultComparer";
import { Lazy, Selector } from "@michaelcoxon/utilities";
import { IQueryable } from "../Interfaces/IQueryable";
import { IQueryableGroup } from "../Interfaces/IQueryableGroup";
import { EnumerableQueryable } from "./EnumerableQueryable";
import { IEnumerable } from "../Interfaces/IEnumerable";

export class QueryableGroup<T, TKey> extends EnumerableQueryable<T> implements IQueryableGroup<T, TKey>
{
    private readonly _parentQueryable: IQueryable<T>;
    private readonly _key: TKey;
    private readonly _keySelector: (item: T) => TKey;

    constructor(parentQueryable: IQueryable<T>, key: TKey, keySelector: Selector<T, TKey>)
    {
        let comparer = new DefaultComparer<TKey>();
        super(parentQueryable.where((item) => comparer.equals(keySelector(item), key)));

        this._parentQueryable = parentQueryable;
        this._key = key;
        this._keySelector = keySelector;
    }

    public get key(): TKey 
    {
        return this._key;
    }
}