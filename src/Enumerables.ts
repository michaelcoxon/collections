﻿import { Undefinable, NotSupportedException, Exception, ArgumentException, ILogger, Predicate, Selector, ConstructorFor } from "@michaelcoxon/utilities";
import { SkipEnumerator, TakeEnumerator, WhereEnumerator, SelectEnumerator, RangeEnumerator, AppendEnumerator, ArrayEnumerator } from "./Enumerators";
import { IQueryable } from "./Interfaces/IQueryable";
import { IEnumerable } from "./Interfaces/IEnumerable";
import { EnumerableQueryable } from "./Queryables/EnumerableQueryable";
import { IEnumerator } from "./Interfaces/IEnumerator";
import { Dictionary } from "./Dictionary";
import { IList } from "./Interfaces/IList";
import { List, ArrayEnumerable } from "./BaseCollections";
import { IDictionary } from "./Interfaces/IDictionary";

export class Enumerable<T> implements IEnumerable<T>
{
    protected _baseEnumerable: IEnumerable<T>;

    constructor(enumerable: IEnumerable<T>)
    {
        this._baseEnumerable = enumerable;
    }

    append(item: T): IEnumerable<T>
    {
        return this.concat(new ArrayEnumerable([item]));
    }

    public asQueryable(): IQueryable<T>
    {
        return new EnumerableQueryable<T>(this);
    }

    concat(next: IEnumerable<T>): IEnumerable<T>
    {
        return new EnumeratorEnumerable(new AppendEnumerator(this.getEnumerator(), next.getEnumerator()));
    }

    contains(item: T): boolean
    {
        return this._baseEnumerable.contains(item);
    }

    // iterates over each item in the Collection. Return false to break.
    public forEach(callback: (value: T, index: number) => boolean | void): void
    {
        const en = this.getEnumerator();
        let index = 0;

        while (en.moveNext())
        {
            if (false === callback(en.current, index++))
            {
                break;
            }
        }
    }

    public getEnumerator(): IEnumerator<T>
    {
        return this._baseEnumerable.getEnumerator();
    }

    public item(index: number): Undefinable<T>
    {
        const result: T[] = [];
        const en = this.getEnumerator();
        let i = 0;

        while (en.moveNext())
        {
            if (index == i++)
            {
                return en.current;
            }
        }
    }

    public ofType<N extends T>(type: { new(...args: any[]): N }): IEnumerable<N>
    {
        return this
            .asQueryable()
            .where((item) => item instanceof type).select((item) => item as N);
    }

    public prepend(item: T): IEnumerable<T>
    {
        return new EnumeratorEnumerable(new AppendEnumerator(new ArrayEnumerator([item]), this.getEnumerator()));
    }

    public toArray(): T[]
    {
        const result: T[] = [];
        const en = this.getEnumerator();

        while (en.moveNext())
        {
            result.push(en.current);
        }

        return result
    }

    public toDictionary<TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): IDictionary<TKey, TValue>
    {
        return new Dictionary(this.asQueryable().select(i => ({ key: keySelector(i), value: valueSelector(i) })));
    }

    public toList(): IList<T>
    {
        return new List<T>(this);
    }

    public static range(start: number, count: number): IEnumerable<number>
    {
        return new RangeEnumerable(start, count)
    }
}

export class RangeEnumerable implements IEnumerable<number>
{
    private readonly _start: number
    private readonly _count: number

    constructor(start: number, count: number)
    {
        this._start = start;
        this._count = count;
    }
    append(item: number): IEnumerable<number>
    {
        return this.concat(new ArrayEnumerable([item]));
    }

    public asQueryable(): IQueryable<number>
    {
        return new EnumerableQueryable<number>(this);
    }

    concat(next: IEnumerable<number>): IEnumerable<number>
    {
        return new EnumeratorEnumerable(new AppendEnumerator(this.getEnumerator(), next.getEnumerator()));
    }

    contains(item: number): boolean
    {
        return new Enumerable(this).contains(item);
    }

    // iterates over each item in the Collection. Return false to break.
    public forEach(callback: (value: number, index: number) => boolean | void): void
    {
        const en = this.getEnumerator();
        let index = 0;

        while (en.moveNext())
        {
            if (false === callback(en.current, index++))
            {
                break;
            }
        }
    }

    public getEnumerator(): IEnumerator<number>
    {
        return new RangeEnumerator(this._start, this._count);
    }

    public item(index: number): Undefinable<number>
    {
        const en = this.getEnumerator();
        let i = 0;

        while (en.moveNext())
        {
            if (index == i++)
            {
                return en.current;
            }
        }
    }

    public ofType<N extends number>(type: { new(...args: any[]): N }): IEnumerable<N>
    {
        return this.asQueryable().ofType(type)
    }

    prepend(item: number): IEnumerable<number>
    {
        return new EnumeratorEnumerable(new AppendEnumerator(new ArrayEnumerator([item]), this.getEnumerator()));
    }

    public toArray(): number[]
    {
        const result: number[] = [];
        const en = this.getEnumerator();

        while (en.moveNext())
        {
            result.push(en.current);
        }

        return result
    }

    public toDictionary<TKey, TValue>(keySelector: (a: number) => TKey, valueSelector: (a: number) => TValue): IDictionary<TKey, TValue>
    {
        return new Dictionary(this.asQueryable().select(i => ({ key: keySelector(i), value: valueSelector(i) })));
    }

    public toList(): IList<number>
    {
        return new List<number>(this);
    }
}

export class SelectEnumerable<T, TReturn> implements IEnumerable<TReturn>
{
    private readonly _enumerable: IEnumerable<T>;
    private readonly _selector: Selector<T, TReturn>;

    constructor(enumerable: IEnumerable<T>, selector: Selector<T, TReturn>)
    {
        this._enumerable = enumerable;
        this._selector = selector;
    }
    append(item: TReturn): IEnumerable<TReturn>
    {
        return this.concat(new ArrayEnumerable([item]));
    }

    public asQueryable(): IQueryable<TReturn>
    {
        return new EnumerableQueryable<TReturn>(this);
    }

    concat(next: IEnumerable<TReturn>): IEnumerable<TReturn>
    {
        return new EnumeratorEnumerable(new AppendEnumerator(this.getEnumerator(), next.getEnumerator()));
    }

    contains(item: TReturn): boolean
    {
        let isContained = false;

        this.forEach(v =>
        {
            if (v === item)
            {
                isContained = true;
                return false;
            }
        });

        return isContained;
    }

    // iterates over each item in the Collection. Return false to break.
    public forEach(callback: (value: TReturn, index: number) => boolean | void): void
    {
        const en = this.getEnumerator();
        let index = 0;

        while (en.moveNext())
        {
            if (false === callback(en.current, index++))
            {
                break;
            }
        }
    }

    public getEnumerator(): IEnumerator<TReturn>
    {
        return new SelectEnumerator<T, TReturn>(this._enumerable.getEnumerator(), this._selector);
    }

    public item(index: number): Undefinable<TReturn>
    {
        const en = this.getEnumerator();
        let i = 0;

        while (en.moveNext())
        {
            if (index == i++)
            {
                return en.current;
            }
        }
    }

    public ofType<N extends TReturn>(type: { new(...args: any[]): N }): IEnumerable<N>
    {
        return this
            .asQueryable()
            .where((item) => item instanceof type).select((item) => item as N);
    }

    public prepend(item: TReturn): IEnumerable<TReturn>
    {
        return new ArrayEnumerable([item]).concat(this);
    }

    public toArray(): TReturn[]
    {
        const result: TReturn[] = [];
        const en = this.getEnumerator();

        while (en.moveNext())
        {
            result.push(en.current);
        }

        return result
    }

    public toDictionary<TKey, TValue>(keySelector: (a: TReturn) => TKey, valueSelector: (a: TReturn) => TValue): IDictionary<TKey, TValue>
    {
        return new Dictionary(this.asQueryable().select(i => ({ key: keySelector(i), value: valueSelector(i) })));
    }

    public toList(): IList<TReturn>
    {
        return new List<TReturn>(this);
    }
}

export class SkipEnumerable<T> extends Enumerable<T>
{
    private _itemsToSkip: number;

    constructor(enumerable: IEnumerable<T>, itemsToSkip: number)
    {
        super(enumerable);
        this._itemsToSkip = itemsToSkip;
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new SkipEnumerator<T>(super.getEnumerator(), this._itemsToSkip);
    }
}

export class TakeEnumerable<T> extends Enumerable<T>
{
    private _itemsToTake: number;

    constructor(enumerable: IEnumerable<T>, itemsToTake: number)
    {
        super(enumerable);
        this._itemsToTake = itemsToTake;
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new TakeEnumerator<T>(super.getEnumerator(), this._itemsToTake);
    }
}

export class WhereEnumerable<T> extends Enumerable<T>
{
    private readonly _predicate: Predicate<T>;

    constructor(enumerable: IEnumerable<T>, predicate: Predicate<T>)
    {
        super(enumerable);
        this._predicate = predicate;
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new WhereEnumerator<T>(super.getEnumerator(), this._predicate);
    }
}

export class EnumeratorEnumerable<T> implements IEnumerable<T>
{
    private readonly _enumerator: IEnumerator<T>;

    constructor(enumerator: IEnumerator<T>)
    {
        this._enumerator = enumerator;
    }

    append(item: T): IEnumerable<T>
    {
        return this.concat(new ArrayEnumerable([item]));
    }

    asQueryable(): IQueryable<T>
    {
        return new EnumerableQueryable(this);
    }

    concat(next: IEnumerable<T>): IEnumerable<T>
    {
        return new EnumeratorEnumerable(new AppendEnumerator(this.getEnumerator(), next.getEnumerator()));
    }

    contains(item: T): boolean
    {
        let isContained = false;

        this.forEach(v =>
        {
            if (v === item)
            {
                isContained = true;
                return false;
            }
        });

        return isContained;
    }

    forEach(callback: (value: T, index: number) => boolean | void): void
    {
        const en = this.getEnumerator();
        let count = 0;
        while (en.moveNext())
        {
            const value = callback(en.current, count);
            if (value === false)
            {
                break;
            }
            count++;
        }
    }

    getEnumerator(): IEnumerator<T>
    {
        return this._enumerator;
    }

    item(index: number): Undefinable<T>
    {
        let obj: Undefinable<T>;

        this.forEach((o, i) =>
        {
            if (i === index || i > index)
            {
                obj = o;
                return false;
            }
        });

        return obj;
    }

    public ofType<N extends T>(ctor: ConstructorFor<N>): IEnumerable<N>
    {
        return this.asQueryable().ofType(ctor);
    }

    public prepend(item: T): IEnumerable<T>
    {
        return new EnumeratorEnumerable(new AppendEnumerator(new ArrayEnumerator([item]), this.getEnumerator()));
    }

    public toArray(): T[]
    {
        const array: T[] = [];
        this.forEach(i =>
        {
            array.push(i);
        });
        return array;
    }

    public toDictionary<TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): IDictionary<TKey, TValue>
    {
        const dictionary = new Dictionary<TKey, TValue>();
        this.forEach(i =>
        {
            dictionary.addKeyValue(keySelector(i), valueSelector(i));
        });
        return dictionary;
    }

    public toList(): IList<T>
    {
        const list = new List<T>();
        this.forEach(i =>
        {
            list.add(i);
        });
        return list;
    }
}