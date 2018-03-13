// private helper functions
import { Utilities, NotSupportedException } from "@michaelcoxon/utilities";
import { QueryableGroup } from "./QueryableGroup";
import { createSelector } from "../Utilities";
import { IQueryable } from "../IQueryable";
import { Predicate, Selector } from "../Types";
import { IQueryableGroup } from "../IQueryableGroup";
import { DefaultComparer } from "../Comparers/DefaultComparer";
import { ReverseComparer } from "../Comparers/ReverseComparer";
import { EnumerableArray } from "../Enumerables/EnumerableArray";
import { IComparer } from "../IComparer";
import { MapComparer } from "../Comparers/MapComparer";

// public class jExt.Collections.Queryable
export class QueryableArray<T> extends EnumerableArray<T> implements IQueryable<T>
{
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
        let selector = createSelector(propertyNameOrSelector);
        let sum = this.sum((item) => selector(item) as number);
        return sum / this.count();
    }

    public count(): number
    {
        return [...this._baseArray].length;
    }

    // USAGE: obj.Distinct(); or obj.Distinct(['key1'],['key2']);
    public distinct<K extends keyof T>(propertyName: K): IQueryable<T>;
    public distinct<R>(selector: (a: T) => R): IQueryable<T>;
    public distinct<K extends keyof T, R>(propertyNameOrSelector: K | ((a: T) => R)): IQueryable<T>
    {
        if ([...this._baseArray].length === 0)
        {
            return new QueryableArray([...this._baseArray]);
        }

        let selector = createSelector(propertyNameOrSelector);
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

        if (set.count() > 0)
        {
            return set.item(0);
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

        if (set.count() > 0)
        {
            return set.item(0);
        }

        return null;
    }

    public groupBy<K extends keyof T>(propertyName: K): IQueryable<IQueryableGroup<T, T[K]>>;
    public groupBy<TKey>(keySelector: Selector<T, TKey>): IQueryable<IQueryableGroup<T, TKey>>;
    public groupBy<K extends keyof T, TKey>(propertyNameOrKeySelector: K | Selector<T, TKey>)
    {
        let keySelector = createSelector(propertyNameOrKeySelector);
        let keySet = this.select(keySelector).distinct((k) => k);
        return keySet.select((key) => new QueryableGroup(this, key, keySelector));
    }

    public last(): T;
    public last(predicate: Predicate<T>): T;
    public last(predicate?: Predicate<T>): T 
    {
        let set = predicate !== undefined
            ? this.where(predicate)
            : this;

        if (set.count() > 0)
        {
            return set.item(set.count() - 1);
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

        if (set.count() > 0)
        {
            return set.item(set.count() - 1);
        }

        return null;
    }

    public max<K extends keyof T>(propertyName: K): number;
    public max(selector: (a: T) => number): number;
    public max<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number
    {
        let selector = createSelector(propertyNameOrSelector);
        let values = this.select((item) => selector(item) as number).toArray();
        return Math.max(...values);
    }

    public min<K extends keyof T>(propertyName: K): number;
    public min(selector: (a: T) => number): number;
    public min<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number
    {
        let selector = createSelector(propertyNameOrSelector);
        let values = this.select((item) => selector(item) as number).toArray();
        return Math.min(...values);
    }

    public ofType<N extends T>(ctor: Utilities.ConstructorFor<N>): IQueryable<N>
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
    public orderBy<K extends keyof T>(propertyName: K, comparer?: IComparer<T[K]>): IQueryable<T>;
    public orderBy<R>(selector: (a: T) => R, comparer?: IComparer<R>): IQueryable<T>;
    public orderBy<K extends keyof T, R>(propertyNameOrSelector: K | ((a: T) => R), comparer?: IComparer<T[K] | R>): IQueryable<T>
    {
        return this.internalOrderBy(
            createSelector(propertyNameOrSelector),
            comparer || new DefaultComparer<T[K] | R>());
    }

    // Orders the set by specified keys where the first orderby 
    // param is first preference. the key can be a method name 
    // without parenthesis.
    // USAGE: obj.OrderByDescending('key1');
    //        obj.OrderByDescending(function (item) { return item.key1 });
    public orderByDescending<K extends keyof T>(propertyName: K, comparer?: IComparer<T[K]>): IQueryable<T>;
    public orderByDescending<R>(selector: (a: T) => R, comparer?: IComparer<R>): IQueryable<T>;
    public orderByDescending<K extends keyof T, R>(propertyNameOrSelector: K | ((a: T) => R), comparer?: IComparer<T[K] | R>): IQueryable<T>
    {
        return this.internalOrderBy(
            createSelector(propertyNameOrSelector),
            new ReverseComparer(comparer || new DefaultComparer<T[K] | R>()));
    }

    public skip(count: number): IQueryable<T>
    {
        var array = [...this._baseArray];
        array.splice(0, count);
        return new QueryableArray<T>(array);
    }

    // USAGE: obj.Select((o)=>o.key1); USAGE: obj.Select('key1');
    public select<K extends keyof T>(propertyName: K): IQueryable<T[K]>;
    public select<TOut>(selector: Selector<T, TOut>): IQueryable<TOut>;
    public select<K extends keyof T, TOut>(propertyNameOrSelector: K | Selector<T, TOut>)
    {
        let selector = createSelector(propertyNameOrSelector);
        return new QueryableArray([...this._baseArray].map((item) => selector(item)));
    }

    public sum<K extends keyof T>(propertyName: K): number;
    public sum(selector: (a: T) => number): number;
    public sum<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number
    {
        let selector = createSelector(propertyNameOrSelector);
        return this.select((item) => selector(item) as number)
            .toArray()
            .reduce((a, c) => a + c, 0);
    }

    public take(count: number): IQueryable<T>
    {
        return new QueryableArray<T>([...this._baseArray].splice(0, count));
    }

    // Returns the objects that evaluate true on the provided comparer function. 
    // USAGE: obj.Where(function() { return true; });
    public where(predicate: Predicate<T>): IQueryable<T>
    {
        return new QueryableArray<T>([...this._baseArray].filter(predicate));
    }

    private internalOrderBy<R>(selector: (a: T) => R, comparer: IComparer<R>): IQueryable<T>
    {
        let mapComparer = new MapComparer(comparer, selector);
        return new QueryableArray<T>([...this._baseArray].sort((a, b) => mapComparer.compare(a, b)));
    }


}

