import { IQueryable } from "./IQueryable";
import { IQueryableGroup } from "./IQueryableGroup";

export class QueryableGroup<T, TKey> implements IQueryableGroup<T>
{
    private readonly _parentQueryable: IQueryable<T>;
    private readonly _key: TKey;
    private readonly _keySelector: (item: T) => TKey;

    private _groupedRows?: IQueryable<T>;

    constructor(parentQueryable: IQueryable<T>, key: TKey, keySelector: (item: T) => TKey)
    {
        this._parentQueryable = parentQueryable;
        this._key = key;
        this._keySelector = keySelector;
    }

    public get key(): TKey 
    {
        return this._key;
    }

    private get groupedRows(): IQueryable<T>
    {
        let comparer = new DefaultComparer<TKey>();
        return this._groupedRows || (
            this._groupedRows = this._parentQueryable.where((item) => comparer.equals(this._keySelector(item), this._key))
        );
    }

    all(predicate: (item: T) => boolean): boolean
    {
        return this.groupedRows.all(predicate);
    }

    any(predicate?: ((item: T) => boolean) | undefined): boolean
    {
        return this.groupedRows.any(predicate);
    }

    average<K extends keyof T>(propertyName: K): number;
    average(selector: (a: T) => number): number;
    average<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number;
    average(propertyNameOrSelector: any)
    {
        return this.groupedRows.average(propertyNameOrSelector);
    }

    count(): number
    {
        throw new Error("Method not implemented.");
    }

    distinct<K extends keyof T>(propertyName: K): IQueryable<T>;
    distinct<R>(selector: (a: T) => R): IQueryable<T>;
    distinct<K extends keyof T, R>(propertyNameOrSelector: K | ((a: T) => R)): IQueryable<T>;
    distinct(propertyNameOrSelector: any)
    {
        throw new Error("Method not implemented.");
    }

    first(): T;
    first(predicate: (item: T) => boolean): T;
    first(predicate?: ((item: T) => boolean) | undefined): T;
    first(predicate?: any)
    {
        throw new Error("Method not implemented.");
    }

    firstOrDefault(): T | null;
    firstOrDefault(predicate: (item: T) => boolean): T | null;
    firstOrDefault(predicate?: ((item: T) => boolean) | undefined): T | null;
    firstOrDefault(predicate?: any)
    {
        throw new Error("Method not implemented.");
    }

    groupBy<K extends keyof T>(propertyName: K): IQueryable<any>;
    groupBy<TKey>(keySelector: (a: T) => TKey): IQueryable<any>;
    groupBy<K extends keyof T, TKey>(propertyNameOrKeySelector: K | ((a: T) => TKey));
    groupBy(propertyNameOrKeySelector: any)
    {
        throw new Error("Method not implemented.");
    }

    last(): T;
    last(predicate: (item: T) => boolean): T;
    last(predicate?: ((item: T) => boolean) | undefined): T;
    last(predicate?: any)
    {
        throw new Error("Method not implemented.");
    }

    lastOrDefault(): T | null;
    lastOrDefault(predicate: (item: T) => boolean): T | null;
    lastOrDefault(predicate?: ((item: T) => boolean) | undefined): T | null;
    lastOrDefault(predicate?: any)
    {
        throw new Error("Method not implemented.");
    }

    max<K extends keyof T>(propertyName: K): number;
    max(selector: (a: T) => number): number;
    max<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number;
    max(propertyNameOrSelector: any)
    {
        throw new Error("Method not implemented.");
    }

    min<K extends keyof T>(propertyName: K): number;
    min(selector: (a: T) => number): number;
    min<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number;
    min(propertyNameOrSelector: any)
    {
        throw new Error("Method not implemented.");
    }
    ofType<N extends T>(ctor: new (...args: any[]) => N): IQueryable<N>
    {
        throw new Error("Method not implemented.");
    }
    orderBy<K extends keyof T>(propertyName: K, comparer?: IComparer<T[K]> | undefined): IQueryable<T>;
    orderBy<R>(selector: (a: T) => R, comparer?: IComparer<R> | undefined): IQueryable<T>;
    orderBy<K extends keyof T, R>(propertyNameOrSelector: K | ((a: T) => R), comparer?: IComparer<R | T[K]> | undefined): IQueryable<T>;
    orderBy(propertyNameOrSelector: any, comparer?: any)
    {
        throw new Error("Method not implemented.");
    }
    orderByDescending<K extends keyof T>(propertyName: K, comparer?: IComparer<T[K]> | undefined): IQueryable<T>;
    orderByDescending<R>(selector: (a: T) => R, comparer?: IComparer<R> | undefined): IQueryable<T>;
    orderByDescending<K extends keyof T, R>(propertyNameOrSelector: K | ((a: T) => R), comparer?: IComparer<R | T[K]> | undefined): IQueryable<T>;
    orderByDescending(propertyNameOrSelector: any, comparer?: any)
    {
        throw new Error("Method not implemented.");
    }
    skip(count: number): IQueryable<T>
    {
        throw new Error("Method not implemented.");
    }
    select<K extends keyof T>(propertyName: K): IQueryable<T[K]>;
    select<TOut>(selector: (a: T) => TOut): IQueryable<TOut>;
    select<K extends keyof T, TOut>(propertyNameOrSelector: K | ((a: T) => TOut));
    select(propertyNameOrSelector: any)
    {
        throw new Error("Method not implemented.");
    }
    sum<K extends keyof T>(propertyName: K): number;
    sum(selector: (a: T) => number): number;
    sum<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number;
    sum(propertyNameOrSelector: any)
    {
        throw new Error("Method not implemented.");
    }
    take(count: number): IQueryable<T>
    {
        throw new Error("Method not implemented.");
    }
    where(predicate: (item: T) => boolean): IQueryable<T>
    {
        throw new Error("Method not implemented.");
    }
}