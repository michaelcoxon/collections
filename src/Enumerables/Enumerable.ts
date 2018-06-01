import { List, ArrayEnumerable } from "../BaseCollections";
import { Dictionary } from "../Dictionary";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { IQueryable } from "../Interfaces/IQueryable";
import { EnumerableQueryable } from "../Queryables/EnumerableQueryable";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { EnumerableEnumerator } from "../Enumerators/EnumerableEnumerator";
import { IDictionary } from "../Interfaces/IDictionary";
import { IList } from "../Interfaces/IList";
import { Undefinable, NotSupportedException, Exception, ArgumentException, getDefaultLogger } from "@michaelcoxon/utilities";

const logger = getDefaultLogger();

export class Enumerable<T> implements IEnumerable<T>
{
    protected _baseEnumerable: IEnumerable<T>;

    constructor(enumerable: IEnumerable<T>)
    {
        this._baseEnumerable = enumerable;
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
        return new EnumerableEnumerator<T>(this);
    }

    public item(index: number): Undefinable<T>
    {
        return this._baseEnumerable.item(index);
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
        let index = 0;

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
        logger.trace(`Enumerable.range(start: ${start},count: ${count})`);
        return new RangeEnumerable(start, count)
    }
}

class RangeEnumerable implements IEnumerable<number>
{
    private readonly _start: number
    private readonly _count: number

    constructor(start: number, count: number)
    {
        logger.trace(`RangeEnumerable.constructor(start: ${start},count: ${count})`);
        this._start = start;
        this._count = count;
    }

    public asQueryable(): IQueryable<number>
    {
        logger.trace(`RangeEnumerable.asQueryable()`);
        return new EnumerableQueryable<number>(this);
    }

    // iterates over each item in the Collection. Return false to break.
    public forEach(callback: (value: number, index: number) => boolean | void): void
    {
        logger.trace(`RangeEnumerable.forEach`);

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
        logger.trace(`RangeEnumerable.getEnumerator`);
        return new RangeEnumerator(this._start, this._count);
    }

    public item(index: number): Undefinable<number>
    {
        logger.trace(`RangeEnumerable.item(index: ${index})`);
        const result: number[] = [];
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
        logger.trace(`RangeEnumerable.toArray()`);
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
        logger.trace(`RangeEnumerable.toDictionary`);
        return new Dictionary(this.asQueryable().select(i => ({ key: keySelector(i), value: valueSelector(i) })));
    }

    public toList(): IList<number>
    {
        logger.trace(`RangeEnumerable.toList()`);
        return new List<number>(this);
    }
}

class RangeEnumerator implements IEnumerator<number>
{
    private readonly _start: number
    private readonly _count: number
    private readonly _increment: number;

    private _current: number;
    private _iterations: number;


    constructor(start: number, count: number)
    {
        logger.trace(`RangeEnumerator.constructor(start: ${start}, start: ${count})`);
        this._start = start;
        this._count = count;

        this._current = start;
        this._iterations = -1;
        this._increment = this._getIncrement();
    }

    public get current(): number
    {
        logger.trace("RangeEnumerator.current");
        if (this._iterations < 0)
        {
            throw new Exception("Call moveNext first");
        }
        return this._current;
    }

    public moveNext(): boolean
    {
        logger.trace("RangeEnumerator.moveNext");
        try
        {
            this._current = this.peek();

            if (this._current === undefined)
            {
                return false;
            }

            this._iterations++;
            return true;
        }
        catch (ex)
        {
            return false;
        }
    }

    public peek(): number
    {
        logger.trace("RangeEnumerator.peek");
        let index = this._iterations + 1;
        let value = this._start + (index * this._increment)

        if (index == this._count)
        {
            throw new Exception("End of enumerator");
        }

        return value;
    }

    public reset(): void
    {
        logger.trace("RangeEnumerator.reset");
        this._iterations = -1;
    }

    private _getIncrement(): number
    {
        logger.trace("RangeEnumerator._getIncrement");
        const integer = this._start > 0 ? Math.floor(this._start) : Math.ceil(this._start);

        if (this._start != integer)
        {
            throw new ArgumentException("Only integers are supported");
        }

        return 1;
    }
}