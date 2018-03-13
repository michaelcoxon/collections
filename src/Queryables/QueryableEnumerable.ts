import { IQueryable } from "../IQueryable";
import { IQueryableGroup } from "../IQueryableGroup";
import { IEnumerator } from "../IEnumerator";
import { Lazy, Utilities } from "@michaelcoxon/utilities";
import { IEnumerable } from "../IEnumerable";
import { Predicate, Selector } from "../Types";
import { IComparer } from "../IComparer";
import { ReverseComparer } from "../Comparers/ReverseComparer";
import { DefaultComparer } from "../Comparers/DefaultComparer";
import { QueryableGroup } from "./QueryableGroup";
import { QueryableArray } from "./QueryableArray";
import { MapComparer } from "../Comparers/MapComparer";
import { IList } from "../IList";
import { IDictionary } from "../IDictionary";





export class QueryableEnumerable<T> implements IQueryable<T>
{
    private readonly _enumerable: Lazy<IEnumerable<T>>;

    constructor(enumerable: Lazy<IEnumerable<T>>)
    {
        this._enumerable = enumerable;
    }

    public all(predicate: Predicate<T>): boolean
    {
        var output = true;

        output = [...this._enumerable.value.toArray()].every((element) => predicate(element));

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
                output = [...this._enumerable.value.toArray()].some((element) => predicate(element));
            }

            return output;
        }
        else
        {
            return [...this._enumerable.value.toArray()].length > 0;
        }
    }

    public average(selector: (a: T) => number): number
    {
        let sum = this.sum((item) => selector(item) as number);
        return sum / this.count();
    }

    public count(): number
    {
        return [...this._enumerable.value.toArray()].length;
    }

    // USAGE: obj.Distinct(); or obj.Distinct(['key1'],['key2']);
    public distinct<R>(selector: (a: T) => R): IQueryable<T>
    {
        if ([...this._enumerable.value.toArray()].length === 0)
        {
            return new QueryableArray([...this._enumerable.value.toArray()]);
        }

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

    public groupBy<TKey>(selector: Selector<T, TKey>): IQueryable<IQueryableGroup<T, TKey>>
    {
        let keySet = this.select(selector).distinct((k) => k);
        return keySet.select((key) => new QueryableGroup(this, key, selector));
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

    public max(selector: (a: T) => number): number
    {
        let values = this.select((item) => selector(item) as number).toArray();
        return Math.max(...values);
    }

    public min(selector: (a: T) => number): number
    {
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
    public orderBy<R>(selector: (a: T) => R, comparer?: IComparer<R>): IQueryable<T>
    {
        return this.internalOrderBy(selector, comparer || new DefaultComparer<R>());
    }

    // Orders the set by specified keys where the first orderby 
    // param is first preference. the key can be a method name 
    // without parenthesis.
    // USAGE: obj.OrderByDescending('key1');
    //        obj.OrderByDescending(function (item) { return item.key1 });
    public orderByDescending<R>(selector: (a: T) => R, comparer?: IComparer<R>): IQueryable<T>
    {
        return this.internalOrderBy(selector, new ReverseComparer(comparer || new DefaultComparer<R>()));
    }

    public skip(count: number): IQueryable<T>
    {
        var array = [...this._enumerable.value.toArray()];
        array.splice(0, count);
        return new QueryableArray<T>(array);
    }

    // USAGE: obj.Select((o)=>o.key1); USAGE: obj.Select('key1');
    public select<TOut>(selector: Selector<T, TOut>): IQueryable<TOut>
    {
        return new QueryableArray([...this._enumerable.value.toArray()].map((item) => selector(item)));
    }

    public sum(selector: (a: T) => number): number
    {
        return this.select((item) => selector(item) as number)
            .toArray()
            .reduce((a, c) => a + c, 0);
    }

    public take(count: number): IQueryable<T>
    {
        return new QueryableArray<T>([...this._enumerable.value.toArray()].splice(0, count));
    }

    // Returns the objects that evaluate true on the provided comparer function. 
    // USAGE: obj.Where(function() { return true; });
    public where(predicate: Predicate<T>): IQueryable<T>
    {
        return new QueryableArray<T>([...this._enumerable.value.toArray()].filter(predicate));
    }

    public asQueryable(): IQueryable<T>
    {
        return this._enumerable.value.asQueryable();
    }

    public forEach(callback: (value: T, index: number) => boolean | void): void
    {
        return this._enumerable.value.forEach(callback);
    }

    public getEnumerator(): IEnumerator<T>
    {
        return this._enumerable.value.getEnumerator();
    }

    public item(index: number): T
    {
        return this._enumerable.value.item(index);
    }

    public toArray(): T[]
    {
        return this._enumerable.value.toArray();
    }

    public toDictionary<TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): IDictionary<TKey, TValue>
    {
        return this._enumerable.value.toDictionary(keySelector, valueSelector);
    }

    public toList(): IList<T>
    {
        return this._enumerable.value.toList();
    }

    private internalOrderBy<R>(selector: (a: T) => R, comparer: IComparer<R>): IQueryable<T>
    {
        let mapComparer = new MapComparer(comparer, selector);
        return new QueryableArray<T>([...this._enumerable.value.toArray()].sort((a, b) => mapComparer.compare(a, b)));
    }
}