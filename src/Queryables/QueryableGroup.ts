import { IQueryableGroup } from "../IQueryableGroup";
import { IQueryable } from "../IQueryable";
import { DefaultComparer } from "../Comparers/DefaultComparer";
import { Selector } from "../Types";
import { QueryableEnumerable } from "./QueryableEnumerable";
import { IEnumerable } from "../IEnumerable";
import { Lazy } from "@michaelcoxon/utilities";

export class QueryableGroup<T, TKey> extends QueryableEnumerable<T> implements IQueryableGroup<T, TKey>
{
    private readonly _parentQueryable: IQueryable<T>;
    private readonly _key: TKey;
    private readonly _keySelector: (item: T) => TKey;

    constructor(parentQueryable: IQueryable<T>, key: TKey, keySelector: Selector<T, TKey>)
    {
        super(new Lazy(() => this.getGroupedRows()));

        this._parentQueryable = parentQueryable;
        this._key = key;
        this._keySelector = keySelector;
    }

    public get key(): TKey 
    {
        return this._key;
    }

    private getGroupedRows(): IEnumerable<T>
    {
        let comparer = new DefaultComparer<TKey>();
        return this._parentQueryable.where((item) => comparer.equals(this._keySelector(item), this._key));
    }
}