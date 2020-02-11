import { IEnumerator, IAsyncEnumerator } from "./Interfaces/IEnumerator";
import { KeyValuePair } from "./Types";
import { Undefinable, OutOfBoundsException, ILogger, ArgumentException, Exception, Selector, Predicate, isUndefinedOrNull, NullReferenceException, Promisable } from "@michaelcoxon/utilities";
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
    private readonly _start: number
    private readonly _count: number
    private readonly _increment: number;

    private _current?: number;
    private _iterations: number;


    constructor(start: number, count: number)
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
    }

    public get current(): number
    {
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
        let index = this._iterations + 1;
        let value = this._start + (index * this._increment)

        if (index < this._count)
        {
            return value;
        }
    }

    public reset(): void
    {
        this._iterations = -1;
    }
}

export class SelectEnumerator<T, TReturn> implements IEnumerator<TReturn>
{
    private readonly _enumerator: IEnumerator<T>;
    private readonly _selector: Selector<T, TReturn>;

    private _currentItem?: TReturn;

    constructor(enumerator: IEnumerator<T>, selector: Selector<T, TReturn>)
    {
        this._enumerator = enumerator;
        this._selector = selector;
    }

    public get current(): TReturn
    {
        if (this._currentItem === undefined)
        {
            throw new Exception("Current is undefined");
        }
        return this._currentItem;
    }

    public moveNext(): boolean
    {
        this._currentItem = this.peek();

        if (this._currentItem === undefined)
        {
            return false;
        }

        return this._enumerator.moveNext();
    }

    public peek(): Undefinable<TReturn>
    {
        let item = this._enumerator.peek();

        if (item === undefined)
        {
            return;
        }

        return this._selector(item);
    }

    public reset(): void
    {
        this._enumerator.reset();
    }
}

export class SkipEnumerator<T> implements IEnumerator<T> {

    private readonly _enumerator: IEnumerator<T>;
    private readonly _itemsToSkip: number;

    private _currentItem?: T;
    private _count: number;

    constructor(enumerator: IEnumerator<T>, itemsToSkip: number)
    {
        this._enumerator = enumerator;
        this._itemsToSkip = itemsToSkip;
        this._count = 0;
    }

    public get current(): T
    {
        if (this._currentItem === undefined)
        {
            throw new Exception("Current is undefined");
        }
        return this._currentItem;
    }

    public moveNext(): boolean
    {
        this._currentItem = this.peek();

        if (this._currentItem === undefined)
        {
            return false;
        }

        return this._enumerator.moveNext();
    }

    public peek(): Undefinable<T>
    {
        while (this._count < this._itemsToSkip)
        {
            if (!this._enumerator.moveNext())
            {
                return undefined;
            }
            this._count++;
        }
        return this._enumerator.peek();

    }

    public reset(): void
    {
        this._count = 0;
        this._enumerator.reset();
    }
}

export class TakeEnumerator<T> implements IEnumerator<T> {

    private readonly _enumerator: IEnumerator<T>;
    private readonly _itemsToTake: number;

    private _currentItem?: T;
    private _itemsTaken: number;

    constructor(enumerator: IEnumerator<T>, itemsToTake: number)
    {
        this._enumerator = enumerator;
        this._itemsToTake = itemsToTake;
        this._itemsTaken = 0;
    }

    public get current(): T
    {
        if (this._currentItem === undefined)
        {
            throw new Exception("Current is undefined");
        }
        return this._currentItem;
    }

    public moveNext(): boolean
    {
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
        if (this._itemsTaken == this._itemsToTake)
        {
            return;
        }
        return this._enumerator.peek();
    }

    public reset(): void
    {
        this._enumerator.reset();
    }
}

export class WhereEnumerator<T> implements IEnumerator<T> {

    private readonly _enumerator: IEnumerator<T>;
    private readonly _predicate: Predicate<T>;

    private _currentItem?: T;

    constructor(enumerator: IEnumerator<T>, predicate: Predicate<T>)
    {
        this._enumerator = enumerator;
        this._predicate = predicate;
    }

    public get current(): T
    {
        if (this._currentItem === undefined)
        {
            throw new Exception("Current is undefined");
        }
        return this._currentItem;
    }

    public moveNext(): boolean
    {
        this._currentItem = this.peek();

        if (this._currentItem === undefined)
        {
            return false;
        }

        return this._enumerator.moveNext();
    }

    public peek(): Undefinable<T>
    {
        while (true)
        {
            let item = this._enumerator.peek();

            if (item === undefined)
            {
                return;
            }

            if (this._predicate(item))
            {
                return item;
            }

            if (!this._enumerator.moveNext())
            {
                break;
            }
        }
    }

    public reset(): void
    {
        this._enumerator.reset();
    }
}

export class AppendEnumerator<T> implements IEnumerator<T>
{
    private readonly _enumerator: IEnumerator<T>;
    private readonly _appendedItemsEnumerator: IEnumerator<T>;

    private _current: Undefinable<T>;

    constructor(enumerator: IEnumerator<T>, appendedItemsEnumerator: IEnumerator<T>)
    {
        this._enumerator = enumerator;
        this._appendedItemsEnumerator = appendedItemsEnumerator;
    }

    public get current(): T
    {
        if (isUndefinedOrNull(this._current))
        {
            throw new NullReferenceException();
        }
        return this._current;
    }

    public moveNext(): boolean
    {
        if (this._enumerator.moveNext())
        {
            this._current = this._enumerator.current;
            return true;
        }
        else if (this._appendedItemsEnumerator.moveNext())
        {
            this._current = this._appendedItemsEnumerator.current;
            return true;
        }
        else
        {
            this._current = undefined;
            return false;
        }
    }

    public peek(): Undefinable<T>
    {
        let value: Undefinable<T> = undefined;

        if (!isUndefinedOrNull(value = this._enumerator.peek()))
        {
            return value;
        }
        else if (!isUndefinedOrNull(value = this._appendedItemsEnumerator.peek()))
        {
            return value;
        }
        else
        {
            return value;
        }
    }

    public reset(): void
    {
        this._enumerator.reset();
        this._appendedItemsEnumerator.reset();
    }
}

export class AggregateEnumerator<T, TReturn> implements IEnumerator<TReturn>
{
    private readonly _enumerator: IEnumerator<T>;
    private readonly _aggregateFunction: (acumulate: TReturn, current: T) => TReturn;

    private _accumulate?: TReturn;

    constructor(enumerator: IEnumerator<T>, aggregateFunction: (acumulate: TReturn, current: T) => TReturn) 
    {
        this._enumerator = enumerator;
        this._aggregateFunction = aggregateFunction;
    }

    public get current(): TReturn
    {
        if (isUndefinedOrNull(this._accumulate))
        {
            throw new NullReferenceException();
        }
        return this._accumulate;
    }

    moveNext(): boolean
    {
        this._accumulate = this.peek();

        if (this._accumulate === undefined)
        {
            return false;
        }

        return this._enumerator.moveNext();
    }

    peek(): Undefinable<TReturn>
    {
        let item = this._enumerator.peek();

        if (item === undefined)
        {
            return;
        }

        return this._aggregateFunction(this._accumulate!, item);
    }

    reset(): void
    {
        this._enumerator.reset();
        this._accumulate = undefined;
    }
}

export class AsyncEnumerator<T> implements IAsyncEnumerator<T>
{
    // the internal array
    private readonly _baseArray: Promisable<T>[];

    // current pointer location
    private _pointer: number = -1;
    private _current?: T;

    constructor(array: Promisable<T>[])
    {
        this._baseArray = array;
    }

    // returns the current element
    public get current(): T
    {
        if (!isUndefinedOrNull(this._current) && this._pointer < this._baseArray.length && this._pointer >= 0)
        {
            return this._current;
        }
        throw new OutOfBoundsException("internal pointer", 0, this._baseArray.length - 1);
    }

    public async moveNextAsync(): Promise<boolean>
    {
        if (this._pointer < this._baseArray.length)
        {
            this._pointer++;
        }

        if (this._pointer < this._baseArray.length)
        {
            this._current = await this._baseArray[this._pointer];
            return true;
        }
        else
        {
            this._current = undefined;
            return false;
        }
    }
}