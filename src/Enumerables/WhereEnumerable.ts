import { IEnumerator } from "../Interfaces/IEnumerator";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { NullReferenceException, Predicate, Undefinable, Exception, getDefaultLogger } from "@michaelcoxon/utilities";
import { IQueryable } from "../Interfaces/IQueryable";
import { EnumerableQueryable } from "../Queryables/EnumerableQueryable";
import { EnumerableEnumerator } from "../Enumerators/EnumerableEnumerator";
import { Dictionary } from "../Dictionary";
import { List } from "../BaseCollections";
import { IDictionary } from "../Interfaces/IDictionary";
import { IList } from "../Interfaces/IList";
import { fail } from "assert";

const logger = getDefaultLogger();

export class WhereEnumerable<T> implements IEnumerable<T>
{
    private readonly _predicate: Predicate<T>;
    private readonly _enumerable: IEnumerable<T>;

    constructor(enumerable: IEnumerable<T>, predicate: Predicate<T>)
    {
        this._enumerable = enumerable;
        this._predicate = predicate;
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
        return new WhereEnumerator<T>(this._enumerable, this._predicate);
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
}

class WhereEnumerator<T> implements IEnumerator<T> {

    private readonly _enumerator: IEnumerator<T>;
    private readonly _predicate: Predicate<T>;

    private _currentItem?: T;

    constructor(enumerable: IEnumerable<T>, predicate: Predicate<T>)
    {
        logger.trace("WhereEnumerator.constructor");
        this._enumerator = enumerable.getEnumerator();
        this._predicate = predicate;
    }

    public get current(): T
    {
        logger.trace("WhereEnumerator.current");
        return this._currentItem!;
    }

    public moveNext(): boolean
    {
        logger.trace("WhereEnumerator.moveNext");
        try
        {
            this._currentItem = this.peek();

            if (this._currentItem === undefined)
            {
                return false;
            }

            return this._enumerator.moveNext();
        }
        catch (ex)
        {
            return false;
        }
    }

    public peek(): T
    {
        logger.trace("WhereEnumerator.peek");
        try
        {
            while (true)
            {
                let item = this._enumerator.peek();

                if (item === undefined)
                {
                    logger.trace("WhereEnumerator.peek: item undefined");
                    throw new Exception("End of enumerator");
                }

                if (this._predicate(item))
                {
                    logger.trace("WhereEnumerator.peek: item found");
                    return item;
                }

                logger.trace("WhereEnumerator.peek: item not found, next");
                if (!this._enumerator.moveNext())
                {
                    logger.trace("WhereEnumerator.peek: End of enumerator");
                    break;
                }
            }
        }
        catch
        {

        }
        throw new Exception("End of enumerator");
    }

    public reset(): void
    {
        logger.trace("WhereEnumerator.reset");
        this._enumerator.reset();
    }
}