import { ConstructorFor, isUndefinedOrNull, Predicate, Selector, Undefinable, Utilities, NotImplementedException } from "@michaelcoxon/utilities";
import { ArrayEnumerable } from "../BaseCollections";
import { DefaultComparer } from "../Comparers/DefaultComparer";
import { MapComparer } from "../Comparers/MapComparer";
import { ReverseComparer } from "../Comparers/ReverseComparer";
import { SelectEnumerable, SkipEnumerable, TakeEnumerable, WhereEnumerable } from "../Enumerables";
import { IComparer } from "../Interfaces/IComparer";
import { IDictionary } from "../Interfaces/IDictionary";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { IList } from "../Interfaces/IList";
import { IQueryable } from "../Interfaces/IQueryable";
import { IQueryableGroup } from "../Interfaces/IQueryableGroup";





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

    public append(item: T): IEnumerable<T>
    {
        return this._enumerable.append(item).asQueryable();
    }

    public average(selector: Selector<T, number>): number
    {
        let sum = this.sum(selector);
        return sum / this.count();
    }

    public concat(next: IEnumerable<T>): IEnumerable<T>
    {
        return this._enumerable.concat(next).asQueryable();
    }

    public contains(item: T): boolean
    {
        return this._enumerable.contains(item);
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
        let enumerable = this._enumerable;

        if (predicate !== undefined)
        {
            enumerable = new WhereEnumerable(enumerable, predicate);
        }

        const en = enumerable.getEnumerator();

        if (en.moveNext())
        {
            return en.current;
        }

        throw new Error("The collection is empty!");
    }

    public firstOrDefault(): T | null;
    public firstOrDefault(predicate: Predicate<T>): T | null;
    public firstOrDefault(predicate?: Predicate<T>): T | null
    {
        let enumerable = this._enumerable;

        if (predicate !== undefined)
        {
            enumerable = new WhereEnumerable(enumerable, predicate);
        }

        const en = enumerable.getEnumerator();

        if (en.moveNext())
        {
            return en.current;
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
        let enumerable = this._enumerable;

        if (predicate !== undefined)
        {
            enumerable = new WhereEnumerable(enumerable, predicate);
        }

        const en = enumerable.getEnumerator();

        if (en.moveNext())
        {
            let value = en.current;

            while (en.moveNext())
            {
                value = en.current;
            }

            return value;
        }
        else
        {
            if (predicate !== undefined)
            {
                throw new Error("There is no last item matching the predicate!");
            }
            else
            {
                throw new Error("The collection is empty!");
            }
        }
    }

    public lastOrDefault(): T | null;
    public lastOrDefault(predicate: Predicate<T>): T | null;
    public lastOrDefault(predicate?: Predicate<T>): T | null
    {
        let enumerable = this._enumerable;

        if (predicate !== undefined)
        {
            enumerable = new WhereEnumerable(enumerable, predicate);
        }

        const en = enumerable.getEnumerator();

        if (en.moveNext())
        {
            let value = en.current;

            while (en.moveNext())
            {
                value = en.current;
            }

            return value;
        }
        else
        {
            return null;
        }
    }

    public max(selector: Selector<T, number>): number
    {
        const values = this.select(selector).toArray();
        return Math.max(...values);
    }

    public min(selector: Selector<T, number>): number
    {
        const values = this.select(selector).toArray();
        return Math.min(...values);
    }

    public ofType<N extends T>(ctor: ConstructorFor<N>): IQueryable<N>
    {
        return this.where((item) => item instanceof ctor).select((item) => item as N);
    }

    // Orders the set by specified keys where the first orderby 
    // param is first preference. the key can be a method name 
    // without parenthesis.
    // USAGE: obj.OrderBy(function (item) { return item.key1 });
    public orderBy<R>(selector: (a: T) => R, comparer?: IComparer<R>): IQueryable<T>
    {
        return this.internalOrderBy(selector, comparer || new DefaultComparer<R>());
    }

    // Orders the set by specified keys where the first orderby 
    // param is first preference. the key can be a method name 
    // without parenthesis.
    // USAGE: obj.OrderByDescending(function (item) { return item.key1 });
    public orderByDescending<R>(selector: (a: T) => R, comparer?: IComparer<R>): IQueryable<T>
    {
        return this.internalOrderBy(selector, new ReverseComparer(comparer || new DefaultComparer<R>()));
    }

    public prepend(item: T): IQueryable<T>
    {
        return this._enumerable.prepend(item).asQueryable()
    }

    public single(): T;
    public single(predicate: Predicate<T>): T;
    public single(predicate?: Predicate<T>): T
    {
        let enumerable = this._enumerable;

        if (predicate !== undefined)
        {
            enumerable = new WhereEnumerable(enumerable, predicate);
        }

        const en = enumerable.getEnumerator();

        let returnValue: Undefinable<T>;

        while (en.moveNext())
        {
            if (!isUndefinedOrNull(returnValue))
            {
                throw new Error("More than one match in the collection!");
            }
            returnValue = en.current;
        }

        if (isUndefinedOrNull(returnValue))
        {
            throw new Error("The collection is empty!");
        }

        return returnValue;
    }

    public singleOrDefault(): T | null;
    public singleOrDefault(predicate: Predicate<T>): T | null;
    public singleOrDefault(predicate?: Predicate<T>): T | null
    {
        let enumerable = this._enumerable;

        if (predicate !== undefined)
        {
            enumerable = new WhereEnumerable(enumerable, predicate);
        }

        const en = enumerable.getEnumerator();

        let returnValue: Undefinable<T>;

        while (en.moveNext())
        {
            if (!isUndefinedOrNull(returnValue))
            {
                return null;
            }
            returnValue = en.current;
        }

        if (isUndefinedOrNull(returnValue))
        {
            return null;
        }

        return returnValue;
    }


    public skip(count: number): IQueryable<T>
    {
        return new SkipEnumerable(this._enumerable, count).asQueryable();
    }

    // USAGE: obj.Select((o)=>o.key1); USAGE: obj.Select('key1');
    public select<TOut>(selector: Selector<T, TOut>): IQueryable<TOut>
    {
        return new SelectEnumerable<T, TOut>(this._enumerable, selector).asQueryable();
    }

    public split(predicate: Predicate<T>): { pTrue: IQueryable<T>, pFalse: IQueryable<T> }
    {
        return {
            pTrue: this.where(i => predicate(i)),
            pFalse: this.where(i => !predicate(i))
        };
    }


    public sum(selector: Selector<T, number>): number
    {
        return this.select((item) => selector(item) as number)
            .toArray()
            .reduce((a, c) => a + c, 0);
    }

    public take(count: number): IQueryable<T>
    {
        return new TakeEnumerable(this._enumerable, count).asQueryable();
    }

    // Returns the objects that evaluate true on the provided comparer function. 
    // USAGE: obj.Where(function() { return true; });
    public where(predicate: Predicate<T>): IQueryable<T>
    {
        return new WhereEnumerable(this._enumerable, predicate).asQueryable();
    }

    public asQueryable(): IQueryable<T>
    {
        return this._enumerable.asQueryable();
    }

    public forEach(callback: (value: T, index: number) => boolean | void): void
    {
        return this._enumerable.forEach(callback);
    }

    public getEnumerator(): IEnumerator<T>
    {
        return this._enumerable.getEnumerator();
    }

    public item(index: number): Undefinable<T>
    {
        return this._enumerable.item(index);
    }

    public toArray(): T[]
    {
        return this._enumerable.toArray();
    }

    public toDictionary<TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): IDictionary<TKey, TValue>
    {
        return this._enumerable.toDictionary(keySelector, valueSelector);
    }

    public toList(): IList<T>
    {
        return this._enumerable.toList();
    }

    private internalOrderBy<R>(selector: (a: T) => R, comparer: IComparer<R>): IQueryable<T>
    {
        let mapComparer = new MapComparer(comparer, selector);
        return new ArrayEnumerable<T>([...this._enumerable.toArray()].sort((a, b) => mapComparer.compare(a, b))).asQueryable();
    }
}

export class QueryableGroup<T, TKey> extends EnumerableQueryable<T> implements IQueryableGroup<T, TKey>
{
    private readonly _parentQueryable: IQueryable<T>;
    private readonly _key: TKey;
    private readonly _keySelector: (item: T) => TKey;

    constructor(parentQueryable: IQueryable<T>, key: TKey, keySelector: Selector<T, TKey>, keyComparer: IComparer<TKey> = new DefaultComparer<TKey>())
    {
        super(parentQueryable.where((item) => keyComparer.equals(keySelector(item), key)));

        this._parentQueryable = parentQueryable;
        this._key = key;
        this._keySelector = keySelector;
    }

    public get key(): TKey 
    {
        return this._key;
    }
}