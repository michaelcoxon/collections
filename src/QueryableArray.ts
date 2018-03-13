// private helper functions
import { Collection } from "./Collection";
import { Utilities, NotSupportedException } from "@michaelcoxon/utilities";
import { IComparer, DefaultComparer, ReverseComparer, MapComparer } from "./Comparer";

export type Predicate<T> = (item: T) => boolean;

// public class jExt.Collections.Queryable
export class QueryableArray<T>
{
    private readonly _baseArray: T[];

    constructor(array: T[])
    {
        [...this._baseArray] = array;
    }

    public all(predicate: Predicate<T>): boolean
    {
        var output = true;

        output = [...this._baseArray].every((element) => predicate(element));

        return output;
    }

    public any(predicate?: Predicate<T>): boolean
    {
        if (predicate !== undefined)
        {
            var output = false;

            if (!Array.prototype.some)
            {
                output = !this.all((element) => !predicate(element));
            }
            else
            {
                output = [...this._baseArray].some((element) => predicate(element));
            }

            return output;
        }
        else
        {
            return [...this._baseArray].length > 0;
        }
    }

    public average<K extends keyof T>(propertyName: K): number;
    public average(selector: (a: T) => number): number;
    public average<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number
    {
        let selector = this.createSelector(propertyNameOrSelector);
        let sum = this.sum((item) => selector(item) as number);
        return sum / this.count();
    }

    public count(): number
    {
        return [...this._baseArray].length;
    }

    // USAGE: obj.Distinct(); or obj.Distinct(['key1'],['key2']);
    public distinct<K extends keyof T>(propertyName: K): QueryableArray<T>;
    public distinct<R>(selector: (a: T) => R): QueryableArray<T>;
    public distinct<K extends keyof T, R>(propertyNameOrSelector: K | ((a: T) => R)): QueryableArray<T>
    {
        if ([...this._baseArray].length === 0)
        {
            return new QueryableArray([...this._baseArray]);
        }

        let selector = this.createSelector(propertyNameOrSelector);
        let temp: { [key: string]: boolean } = {};

        return this.where((item) =>
        {
            let value = selector(item);
            let s_value: string;

            if (value instanceof Object)
            {
                s_value = Utilities.getHash(value);
            }
            else
            {
                s_value = "" + value;
            }

            if (!temp[s_value])
            {
                temp[s_value] = true;
                return true;
            }

            return false;
        });
    }

    public first(): T;
    public first(predicate: Predicate<T>): T;
    public first(predicate?: Predicate<T>): T
    {
        let set = predicate !== undefined
            ? this.where(predicate)
            : this;

        if (set._baseArray.length > 0)
        {
            return set._baseArray[0];
        }

        throw new Error("The collection is empty!");
    }

    public firstOrDefault(): T | null;
    public firstOrDefault(predicate: Predicate<T>): T | null;
    public firstOrDefault(predicate?: Predicate<T>): T | null
    {
        let set = predicate !== undefined
            ? this.where(predicate)
            : this;

        if (set._baseArray.length > 0)
        {
            return set._baseArray[0];
        }

        return null;
    }

    public groupBy<K extends keyof T>(propertyName: K): QueryableArray<GroupedQueryable<T, T[K]>>;
    public groupBy<TKey>(keySelector: (a: T) => TKey): QueryableArray<GroupedQueryable<T, TKey>>;
    public groupBy<K extends keyof T, TKey>(propertyNameOrKeySelector: K | ((a: T) => TKey))
    {
        let keySelector = this.createSelector(propertyNameOrKeySelector);
        let keySet = this.select(keySelector).distinct((k) => k);
        return keySet.select((key) => new GroupedQueryable(this, key, keySelector));
    }

    public last(): T;
    public last(predicate: Predicate<T>): T;
    public last(predicate?: Predicate<T>): T 
    {
        let set = predicate !== undefined
            ? this.where(predicate)
            : this;

        if (set._baseArray.length > 0)
        {
            return set._baseArray[set._baseArray.length - 1];
        }

        throw new Error("The collection is empty!");
    }

    public lastOrDefault(): T | null;
    public lastOrDefault(predicate: Predicate<T>): T | null;
    public lastOrDefault(predicate?: Predicate<T>): T | null
    {
        let set = predicate !== undefined
            ? this.where(predicate)
            : this;

        if (set._baseArray.length > 0)
        {
            return set._baseArray[set._baseArray.length - 1];
        }

        return null;
    }

    public max<K extends keyof T>(propertyName: K): number;
    public max(selector: (a: T) => number): number;
    public max<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number
    {
        let selector = this.createSelector(propertyNameOrSelector);
        let values = this.select((item) => selector(item) as number)._baseArray;
        return Math.max(...values);
    }

    public min<K extends keyof T>(propertyName: K): number;
    public min(selector: (a: T) => number): number;
    public min<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number
    {
        let selector = this.createSelector(propertyNameOrSelector);
        let values = this.select((item) => selector(item) as number)._baseArray;
        return Math.min(...values);
    }

    public ofType<N extends T>(ctor: Utilities.ConstructorFor<N>): QueryableArray<N>
    {
        return this
            .where((item) => item instanceof ctor)
            .select((item) => item as N);
    }

    // Orders the set by specified keys where the first orderby 
    // param is first preference. the key can be a method name 
    // without parenthesis.
    // USAGE: obj.OrderBy('key1');
    //        obj.OrderBy(function (item) { return item.key1 });
    public orderBy<K extends keyof T>(propertyName: K, comparer?: IComparer<T[K]>): QueryableArray<T>;
    public orderBy<R>(selector: (a: T) => R, comparer?: IComparer<R>): QueryableArray<T>;
    public orderBy<K extends keyof T, R>(propertyNameOrSelector: K | ((a: T) => R), comparer?: IComparer<T[K] | R>): QueryableArray<T>
    {
        return this.internalOrderBy(
            this.createSelector(propertyNameOrSelector),
            comparer || new DefaultComparer<T[K] | R>());
    }

    // Orders the set by specified keys where the first orderby 
    // param is first preference. the key can be a method name 
    // without parenthesis.
    // USAGE: obj.OrderByDescending('key1');
    //        obj.OrderByDescending(function (item) { return item.key1 });
    public orderByDescending<K extends keyof T>(propertyName: K, comparer?: IComparer<T[K]>): QueryableArray<T>;
    public orderByDescending<R>(selector: (a: T) => R, comparer?: IComparer<R>): QueryableArray<T>;
    public orderByDescending<K extends keyof T, R>(propertyNameOrSelector: K | ((a: T) => R), comparer?: IComparer<T[K] | R>): QueryableArray<T>
    {
        return this.internalOrderBy(
            this.createSelector(propertyNameOrSelector),
            new ReverseComparer(comparer || new DefaultComparer<T[K] | R>()));
    }

    public skip(count: number): QueryableArray<T>
    {
        var array = [...this._baseArray];
        array.splice(0, count);
        return new QueryableArray<T>(array);
    }

    // USAGE: obj.Select((o)=>o.key1); USAGE: obj.Select('key1');
    public select<K extends keyof T>(propertyName: K): QueryableArray<T[K]>;
    public select<TOut>(selector: (a: T) => TOut): QueryableArray<TOut>;
    public select<K extends keyof T, TOut>(propertyNameOrSelector: K | ((a: T) => TOut))
    {
        let selector = this.createSelector(propertyNameOrSelector);
        return new QueryableArray([...this._baseArray].map((item) => selector(item)));
    }

    public sum<K extends keyof T>(propertyName: K): number;
    public sum(selector: (a: T) => number): number;
    public sum<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number
    {
        let selector = this.createSelector(propertyNameOrSelector);
        return this.select((item) => selector(item) as number)
            ._baseArray
            .reduce((a, c) => a + c, 0);
    }

    public take(count: number): QueryableArray<T>
    {
        return new QueryableArray<T>([...this._baseArray].splice(0, count));
    }

    // Returns the objects that evaluate true on the provided comparer function. 
    // USAGE: obj.Where(function() { return true; });
    public where(predicate: Predicate<T>): QueryableArray<T>
    {
        return new QueryableArray<T>([...this._baseArray].filter(predicate));
    }

    private internalOrderBy<R>(selector: (a: T) => R, comparer: IComparer<R>): QueryableArray<T>
    {
        let mapComparer = new MapComparer(comparer, selector);
        return new QueryableArray<T>([...this._baseArray].sort((a, b) => mapComparer.compare(a, b)));
    }

    private createSelector<K extends keyof T, R>(propertyNameOrSelector: K | ((a: T) => R)): ((a: T) => T[K] | R)
    {
        if (typeof propertyNameOrSelector === 'string')
        {
            return (a: T) =>
            {
                if (typeof a[propertyNameOrSelector] === 'function')
                {
                    throw new NotSupportedException(`property names that are functions ('${propertyNameOrSelector}')`);
                }
                return a[propertyNameOrSelector];
            }
        }
        else
        {
            return propertyNameOrSelector as (a: T) => R;
        }
    }
}

export class GroupedQueryable<T, TKey>
{
    private readonly _parentQueryable: QueryableArray<T>;
    private readonly _key: TKey;
    private readonly _keySelector: (item: T) => TKey;

    private _groupedRows?: QueryableArray<T>;

    constructor(parentQueryable: QueryableArray<T>, key: TKey, keySelector: (item: T) => TKey)
    {
        this._parentQueryable = parentQueryable;
        this._key = key;
        this._keySelector = keySelector;
    }

    public get key(): TKey 
    {
        return this._key;
    }

    public get groupedRows(): QueryableArray<T>
    {
        let comparer = new DefaultComparer<TKey>();
        return this._groupedRows || (
            this._groupedRows = this._parentQueryable.where((item) => comparer.equals(this._keySelector(item), this._key))
        );
    }
}
