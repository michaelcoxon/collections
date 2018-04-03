import { IQueryable } from "../Interfaces/IQueryable";
import { IQueryableGroup } from "../Interfaces/IQueryableGroup";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { Lazy, Utilities } from "@michaelcoxon/utilities";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { Predicate, Selector } from "../Types";
import { IComparer } from "../Interfaces/IComparer";
import { ReverseComparer } from "../Comparers/ReverseComparer";
import { DefaultComparer } from "../Comparers/DefaultComparer";
import { QueryableGroup } from "./QueryableGroup";
import { ArrayQueryable } from "./QueryableArray";
import { MapComparer } from "../Comparers/MapComparer";
import { IList } from "../Interfaces/IList";
import { IDictionary } from "../Interfaces/IDictionary";





export class EnumerableQueryable<T> implements IQueryable<T>
{
    private readonly _enumerable: IEnumerable<T>;

    constructor(enumerable: IEnumerable<T>)
    {
        this._enumerable = enumerable;
    }

    public all(predicate: Predicate<T>): boolean
    {
        let output = true;
        const en = this._enumerable.getEnumerator();

        while (output && en.moveNext())
        {
            output = predicate(en.current);
        }

        return output;
    }

    public any(predicate?: Predicate<T>): boolean
    {
        const en = this._enumerable.getEnumerator();

        if (predicate !== undefined)
        {
            let output = false;

            while (!output && en.moveNext())
            {
                output = predicate(en.current);
            }

            return output;
        }
        else
        {
            return en.moveNext();
        }
    }

    public average(selector: (a: T) => number): number
    {
        let sum = this.sum((item) => selector(item) as number);
        return sum / this.count();
    }

    public count(): number
    {
        let itemCount = 0;
        const en = this._enumerable.getEnumerator();
        while (en.moveNext())
        {
            itemCount++;
        }
        return itemCount;
    }

    // USAGE: obj.Distinct(); or obj.Distinct(['key1'],['key2']);
    public distinct<R>(selector: (a: T) => R): IQueryable<T>
    {
        let temp: { [key: string]: boolean } = {};

        return new EnumerableQueryable(this.where((item) =>
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
        }));
    }

    public first(): T;
    public first(predicate: Predicate<T>): T;
    public first(predicate?: Predicate<T>): T
    {
        const en = this._enumerable.getEnumerator();

        if (predicate !== undefined)
        {
            while (en.moveNext)
            {
                if (predicate(en.current))
                {
                    return en.current;
                }
            }
        }
        else
        {
            while (en.moveNext)
            {
                return en.current;
            }
        }

        throw new Error("The collection is empty!");
    }

    public firstOrDefault(): T | null;
    public firstOrDefault(predicate: Predicate<T>): T | null;
    public firstOrDefault(predicate?: Predicate<T>): T | null
    {
        const en = this._enumerable.getEnumerator();

        if (predicate !== undefined)
        {
            while (en.moveNext)
            {
                if (predicate(en.current))
                {
                    return en.current;
                }
            }
        }
        else
        {
            while (en.moveNext)
            {
                return en.current;
            }
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
        if (predicate === undefined)
        {
            if ((this._enumerable as any).count)
            {
                const count = (this._enumerable as any).count;
                if (count > 0)
                {
                    return this._enumerable.item(count - 1);
                }
            }
            else
            {
                const en = this._enumerable.getEnumerator();
                if (en.moveNext())
                {
                    let result: T;
                    do
                    {
                        result = en.current;
                    }
                    while (en.moveNext());

                    return result;
                }
            }
        }
        else
        {
            let result: T | undefined;
            let found = false;
            const en = this._enumerable.getEnumerator();

            while (en.moveNext())
            {
                if (predicate(en.current))
                {
                    result = en.current;
                    found = true;
                }
            }

            if (found && result !== undefined)
            {
                return result;
            }
            else
            {
                throw new Error("There is no last item matching the predicate!");
            }
        }

        throw new Error("The collection is empty!");
    }

    public lastOrDefault(): T | null;
    public lastOrDefault(predicate: Predicate<T>): T | null;
    public lastOrDefault(predicate?: Predicate<T>): T | null
    {
        if (predicate === undefined)
        {
            if ((this._enumerable as any).count)
            {
                const count = (this._enumerable as any).count;
                if (count > 0)
                {
                    return this._enumerable.item(count - 1);
                }
            }
            else
            {
                const en = this._enumerable.getEnumerator();
                if (en.moveNext())
                {
                    let result: T;
                    do
                    {
                        result = en.current;
                    }
                    while (en.moveNext());

                    return result;
                }
            }
        }
        else
        {
            let result: T | undefined;
            let found = false;
            const en = this._enumerable.getEnumerator();

            while (en.moveNext())
            {
                if (predicate(en.current))
                {
                    result = en.current;
                    found = true;
                }
            }

            if (found && result !== undefined)
            {
                return result;
            }
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
        const en = this._enumerable.getEnumerator();

        while (count > 0 && en.moveNext())
        {
            count--;
        }

        const array: T[] = [];

        if (count <= 0)
        {
            while (en.moveNext())
            {
                array.push( en.current);
            }
        }

        return new ArrayQueryable(array);
    }

    // USAGE: obj.Select((o)=>o.key1); USAGE: obj.Select('key1');
    public select<TOut>(selector: Selector<T, TOut>): IQueryable<TOut>
    {
        return new ArrayQueryable([...this._enumerable.value.toArray()].map((item) => selector(item)));
    }

    public sum(selector: (a: T) => number): number
    {
        return this.select((item) => selector(item) as number)
            .toArray()
            .reduce((a, c) => a + c, 0);
    }

    public take(count: number): IQueryable<T>
    {
        return new ArrayQueryable<T>([...this._enumerable.value.toArray()].splice(0, count));
    }

    // Returns the objects that evaluate true on the provided comparer function. 
    // USAGE: obj.Where(function() { return true; });
    public where(predicate: Predicate<T>): IQueryable<T>
    {
        return new ArrayQueryable<T>([...this._enumerable.value.toArray()].filter(predicate));
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
        return new ArrayQueryable<T>([...this._enumerable.value.toArray()].sort((a, b) => mapComparer.compare(a, b)));
    }
}