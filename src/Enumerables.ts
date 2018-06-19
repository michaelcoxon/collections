import { Undefinable, NotSupportedException, Exception, ArgumentException, getDefaultLogger, ILogger, Predicate, Selector } from "@michaelcoxon/utilities";
import { SkipEnumerator, TakeEnumerator, WhereEnumerator, SelectEnumerator, RangeEnumerator } from "./Enumerators";
import { IQueryable } from "./Interfaces/IQueryable";
import { IEnumerable } from "./Interfaces/IEnumerable";
import { EnumerableQueryable } from "./Queryables/EnumerableQueryable";
import { IEnumerator } from "./Interfaces/IEnumerator";
import { Dictionary } from "./Dictionary";
import { IList } from "./Interfaces/IList";
import { List } from "./BaseCollections";
import { IDictionary } from "./Interfaces/IDictionary";

export class Enumerable<T> implements IEnumerable<T>
{
    protected readonly _logger: ILogger;
    protected _baseEnumerable: IEnumerable<T>;

    constructor(enumerable: IEnumerable<T>, logger: ILogger = getDefaultLogger().scope("Enumerable"))
    {
        this._baseEnumerable = enumerable;
        this._logger = logger;
    }

    public asQueryable(): IQueryable<T>
    {
        return new EnumerableQueryable<T>(this);
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

    public static range(start: number, count: number, logger: ILogger = getDefaultLogger()): IEnumerable<number>
    {
        logger = logger.scope("Enumerable");
        logger.trace(`range(start: ${start},count: ${count})`);
        return new RangeEnumerable(start, count, logger)
    }
}

export class RangeEnumerable implements IEnumerable<number>
{
    private readonly _logger: ILogger;

    private readonly _start: number
    private readonly _count: number

    constructor(start: number, count: number, logger: ILogger = getDefaultLogger())
    {
        this._start = start;
        this._count = count;
        this._logger = logger.scope("RangeEnumerable");
        this._logger.trace(`constructor(start: ${start},count: ${count})`);
    }

    public asQueryable(): IQueryable<number>
    {
        this._logger.trace(`asQueryable()`);
        return new EnumerableQueryable<number>(this);
    }

    // iterates over each item in the Collection. Return false to break.
    public forEach(callback: (value: number, index: number) => boolean | void): void
    {
        this._logger.trace(`forEach`);

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
        this._logger.trace(`getEnumerator`);
        return new RangeEnumerator(this._start, this._count, this._logger);
    }

    public item(index: number): Undefinable<number>
    {
        this._logger.trace(`item(index: ${index})`);
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
        throw new NotSupportedException();
    }

    public toArray(): number[]
    {
        this._logger.trace(`toArray()`);
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
        this._logger.trace(`toDictionary`);
        return new Dictionary(this.asQueryable().select(i => ({ key: keySelector(i), value: valueSelector(i) })));
    }

    public toList(): IList<number>
    {
        this._logger.trace(`toList()`);
        return new List<number>(this);
    }
}

export class SelectEnumerable<T, TReturn> implements IEnumerable<TReturn>
{
    private readonly _logger: ILogger;

    private readonly _enumerable: IEnumerable<T>;
    private readonly _selector: Selector<T, TReturn>;

    constructor(enumerable: IEnumerable<T>, selector: Selector<T, TReturn>, logger: ILogger = getDefaultLogger())
    {
        this._enumerable = enumerable;
        this._selector = selector;
        this._logger = logger.scope("SelectEnumerable");
    }

    public asQueryable(): IQueryable<TReturn>
    {
        return new EnumerableQueryable<TReturn>(this);
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
        return new SelectEnumerator<T, TReturn>(this._enumerable.getEnumerator(), this._selector, this._logger);
    }

    public item(index: number): Undefinable<TReturn>
    {
        const result: TReturn[] = [];
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

    constructor(enumerable: IEnumerable<T>, itemsToSkip: number, logger: ILogger = getDefaultLogger())
    {
        super(enumerable, logger.scope("SkipEnumerable"));
        this._itemsToSkip = itemsToSkip;
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new SkipEnumerator<T>(super.getEnumerator(), this._itemsToSkip, this._logger);
    }
}

export class TakeEnumerable<T> extends Enumerable<T>
{
    private _itemsToTake: number;

    constructor(enumerable: IEnumerable<T>, itemsToTake: number, logger: ILogger = getDefaultLogger())
    {
        super(enumerable, logger.scope("TakeEnumerable"));
        this._itemsToTake = itemsToTake;
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new TakeEnumerator<T>(super.getEnumerator(), this._itemsToTake, this._logger);
    }
}

export class WhereEnumerable<T> extends Enumerable<T>
{
    private readonly _predicate: Predicate<T>;

    constructor(enumerable: IEnumerable<T>, predicate: Predicate<T>, logger: ILogger = getDefaultLogger())
    {
        super(enumerable, logger.scope("WhereEnumerable"));
        this._predicate = predicate;
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new WhereEnumerator<T>(super.getEnumerator(), this._predicate, this._logger);
    }
}
