import { IEnumerator } from "./Interfaces/IEnumerator";
import { KeyValuePair } from "./Types";
import { Undefinable, OutOfBoundsException, getDefaultLogger, ILogger, ArgumentException, Exception, Selector, Predicate } from "@michaelcoxon/utilities";
import { IDictionary } from "./Interfaces/IDictionary";

export class ArrayEnumerator<T> implements IEnumerator<T>
{
    // the internal array
    private readonly _baseArray: T[];

    // current pointer location
    private _pointer: number = -1;

    constructor(array: T[])
    {
        this._baseArray = array;
    }

    // returns the current element
    public get current(): T
    {
        if (this._pointer >= this._baseArray.length || this._pointer < 0)
        {
            this.throwOutOfBoundsException();
        }
        return this._baseArray[this._pointer];
    }

    public moveNext(): boolean
    {
        if (this._pointer < this._baseArray.length)
        {
            this._pointer++;
        }
        return this._pointer < this._baseArray.length
    }

    // returns the next element without moving the pointer forwards
    public peek(): Undefinable<T>
    {
        if (this._pointer + 1 >= this._baseArray.length)
        {
            return;
        }
        return this._baseArray[this._pointer + 1];
    }

    // reset the pointer to the start
    public reset(): void
    {
        this._pointer = -1;
    }

    private throwOutOfBoundsException(): void
    {
        throw new OutOfBoundsException("internal pointer", 0, this._baseArray.length - 1);
    }
}

export class DictionaryEnumerator<TKey, TValue> implements IEnumerator<KeyValuePair<TKey, TValue>>
{
    private readonly _dictionary: IDictionary<TKey, TValue>;
    private readonly _keyEnumerator: IEnumerator<TKey>;

    constructor(dictionary: IDictionary<TKey, TValue>)
    {
        this._dictionary = dictionary;
        this._keyEnumerator = new ArrayEnumerator(dictionary.keys);
    }

    public get current(): KeyValuePair<TKey, TValue>
    {
        const key = this._keyEnumerator.current;
        const value = this._dictionary.itemByKey(key);

        return { key, value };
    }

    public moveNext(): boolean
    {
        return this._keyEnumerator.moveNext();
    }

    public peek(): Undefinable<KeyValuePair<TKey, TValue>>
    {
        const key = this._keyEnumerator.peek();
        if (key === undefined)
        {
            return;
        }
        const value = this._dictionary.itemByKey(key);

        return { key, value };
    }

    public reset(): void
    {
        this._keyEnumerator.reset();
    }
}

export class RangeEnumerator implements IEnumerator<number>
{
    private readonly _logger: ILogger;

    private readonly _start: number
    private readonly _count: number
    private readonly _increment: number;

    private _current?: number;
    private _iterations: number;


    constructor(start: number, count: number, logger: ILogger = getDefaultLogger())
    {
        const integer = start > 0 ? Math.floor(start) : Math.ceil(start);
        if (start != integer)
        {
            throw new ArgumentException("Only integers are supported");
        }

        this._start = start;
        this._count = count;

        this._iterations = -1;
        this._increment = 1;

        this._logger = logger.scope("RangeEnumerator");
        this._logger.trace(`constructor(start: ${start}, start: ${count})`);
    }

    public get current(): number
    {
        this._logger.trace("current");
        if (this._iterations < 0)
        {
            throw new Exception("Call moveNext first");
        }
        if (this._current === undefined)
        {
            throw new Exception("Current is undefined");
        }
        return this._current;
    }

    public moveNext(): boolean
    {
        this._logger.trace("moveNext");
        this._current = this.peek();

        if (this._current === undefined)
        {
            return false;
        }

        this._iterations++;
        return true;
    }

    public peek(): Undefinable<number>
    {
        this._logger.trace("peek");
        let index = this._iterations + 1;
        let value = this._start + (index * this._increment)

        if (index < this._count)
        {
            return value;
        }
    }

    public reset(): void
    {
        this._logger.trace("reset");
        this._iterations = -1;
    }
}

export class SelectEnumerator<T, TReturn> implements IEnumerator<TReturn>
{
    private readonly _logger: ILogger;

    private readonly _enumerator: IEnumerator<T>;
    private readonly _selector: Selector<T, TReturn>;

    private _currentItem?: TReturn;

    constructor(enumerator: IEnumerator<T>, selector: Selector<T, TReturn>, logger: ILogger = getDefaultLogger())
    {
        logger.trace("SelectEnumerator.constructor");
        this._enumerator = enumerator;
        this._selector = selector;
        this._logger = logger.scope("SelectEnumerator");
    }

    public get current(): TReturn
    {
        this._logger.trace("SelectEnumerator.current");
        if (this._currentItem === undefined)
        {
            throw new Exception("Current is undefined");
        }
        return this._currentItem;
    }

    public moveNext(): boolean
    {
        this._logger.trace("SelectEnumerator.moveNext");
        this._currentItem = this.peek();

        if (this._currentItem === undefined)
        {
            return false;
        }

        return this._enumerator.moveNext();
    }

    public peek(): Undefinable<TReturn>
    {
        this._logger.trace("SelectEnumerator.peek");

        let item = this._enumerator.peek();

        if (item === undefined)
        {
            this._logger.trace("SelectEnumerator.peek: item undefined");
            return;
        }

        return this._selector(item);
    }

    public reset(): void
    {
        this._logger.trace("SelectEnumerator.reset");
        this._enumerator.reset();
    }
}

export class SkipEnumerator<T> implements IEnumerator<T> {

    private readonly _logger: ILogger;
    private readonly _enumerator: IEnumerator<T>;
    private readonly _itemsToSkip: number;

    private _currentItem?: T;
    private _hasSkipped: boolean;

    constructor(enumerator: IEnumerator<T>, itemsToSkip: number, logger: ILogger = getDefaultLogger())
    {
        logger.trace("SkipEnumerator.constructor");
        this._enumerator = enumerator;
        this._itemsToSkip = itemsToSkip;
        this._hasSkipped = false;
        this._logger = logger.scope("SkipEnumerator");
    }

    public get current(): T
    {
        this._logger.trace("SkipEnumerator.current");
        if (this._currentItem === undefined)
        {
            throw new Exception("Current is undefined");
        }
        return this._currentItem;
    }

    public moveNext(): boolean
    {
        this._logger.trace("SkipEnumerator.moveNext");
        this._currentItem = this.peek();

        if (this._currentItem === undefined)
        {
            return false;
        }

        return this._enumerator.moveNext();
    }

    public peek(): Undefinable<T>
    {
        this._logger.trace("SkipEnumerator.peek");
        this._ensureSkippedItems();
        return this._enumerator.peek();
    }

    public reset(): void
    {
        this._logger.trace("SkipEnumerator.reset");
        this._enumerator.reset();
    }

    private _ensureSkippedItems()
    {
        if (!this._hasSkipped)
        {
            this._hasSkipped = true;

            for (let i = 0; i < this._itemsToSkip && this._enumerator.moveNext(); i++)
            {
                // do nothing
            }
        }
    }
}

export class TakeEnumerator<T> implements IEnumerator<T> {

    private readonly _logger: ILogger;
    private readonly _enumerator: IEnumerator<T>;
    private readonly _itemsToTake: number;

    private _currentItem?: T;
    private _itemsTaken: number;

    constructor(enumerator: IEnumerator<T>, itemsToTake: number, logger: ILogger = getDefaultLogger())
    {
        this._enumerator = enumerator;
        this._itemsToTake = itemsToTake;
        this._itemsTaken = 0;
        this._logger = logger.scope("TakeEnumerator");
    }

    public get current(): T
    {
        this._logger.trace("current");
        if (this._currentItem === undefined)
        {
            throw new Exception("Current is undefined");
        }
        return this._currentItem;
    }

    public moveNext(): boolean
    {
        this._logger.trace("moveNext");
        this._currentItem = this.peek();

        if (this._currentItem === undefined)
        {
            return false;
        }

        this._itemsTaken++;
        return this._enumerator.moveNext();
    }

    public peek(): Undefinable<T>
    {
        this._logger.trace("peek");
        if (this._itemsTaken == this._itemsToTake)
        {
            return;
        }
        return this._enumerator.peek();
    }

    public reset(): void
    {
        this._logger.trace("reset");
        this._enumerator.reset();
    }
}

export class WhereEnumerator<T> implements IEnumerator<T> {

    private readonly _logger: ILogger;
    private readonly _enumerator: IEnumerator<T>;
    private readonly _predicate: Predicate<T>;

    private _currentItem?: T;

    constructor(enumerator: IEnumerator<T>, predicate: Predicate<T>, logger: ILogger = getDefaultLogger())
    {
        logger.trace("WhereEnumerator.constructor");
        this._enumerator = enumerator;
        this._predicate = predicate;
        this._logger = logger.scope("WhereEnumerator");
    }

    public get current(): T
    {
        this._logger.trace("WhereEnumerator.current");
        if (this._currentItem === undefined)
        {
            throw new Exception("Current is undefined");
        }
        return this._currentItem;
    }

    public moveNext(): boolean
    {
        this._logger.trace("WhereEnumerator.moveNext");
        this._currentItem = this.peek();

        if (this._currentItem === undefined)
        {
            return false;
        }

        return this._enumerator.moveNext();
    }

    public peek(): Undefinable<T>
    {
        this._logger.trace("WhereEnumerator.peek");
        while (true)
        {
            let item = this._enumerator.peek();

            if (item === undefined)
            {
                this._logger.trace("WhereEnumerator.peek: item undefined");
                return;
            }

            if (this._predicate(item))
            {
                this._logger.trace("WhereEnumerator.peek: item found");
                return item;
            }

            this._logger.trace("WhereEnumerator.peek: item not found, next");
            if (!this._enumerator.moveNext())
            {
                this._logger.trace("WhereEnumerator.peek: End of enumerator");
                break;
            }
        }
    }

    public reset(): void
    {
        this._logger.trace("WhereEnumerator.reset");
        this._enumerator.reset();
    }
}