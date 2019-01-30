import { Undefinable, ArgumentException, Predicate, Selector, ConstructorFor, Utilities, KeyAlreadyDefinedException, KeyNotFoundException } from "@michaelcoxon/utilities";
import { SkipEnumerator, TakeEnumerator, WhereEnumerator, SelectEnumerator, RangeEnumerator, AppendEnumerator, ArrayEnumerator, AggregateEnumerator, DictionaryEnumerator } from "./Enumerators";
import { IQueryable } from "./Interfaces/IQueryable";
import { IEnumerable } from "./Interfaces/IEnumerable";
import { EnumerableQueryable } from "./Queryables/EnumerableQueryable";
import { IEnumerator } from "./Interfaces/IEnumerator";
import { IList } from "./Interfaces/IList";
import { IDictionary } from "./Interfaces/IDictionary";
import { ICollection } from './Interfaces/ICollection';
import { IEnumerableOrArray, KeyValuePair } from './Types';
import { IComparer } from './Interfaces/IComparer';
import { DefaultComparer } from './Comparers/DefaultComparer';

export class Enumerable
{
    public static range(start: number, count: number): IEnumerable<number>
    {
        return new RangeEnumerable(start, count)
    }

    public static empty<TElement>(): IEnumerable<TElement>
    {
        return new ArrayEnumerable<TElement>([]);
    }

    public static asArray<T>(array: T[]): T[];
    public static asArray<T>(enumerable: IEnumerable<T>): T[];
    public static asArray<T>(enumerableOrArray: IEnumerableOrArray<T>): T[];
    public static asArray<T>(enumerableOrArray: IEnumerableOrArray<T>): T[]
    {
        if (Array.isArray(enumerableOrArray))
        {
            // copy the array into this
            return [...enumerableOrArray];
        }
        else
        {
            return enumerableOrArray.toArray();
        }
    }

    public static asEnumerable<T>(array: T[]): IEnumerable<T>;
    public static asEnumerable<T>(enumerable: IEnumerable<T>): IEnumerable<T>;
    public static asEnumerable<T>(enumerableOrArray: IEnumerableOrArray<T>): IEnumerable<T>;
    public static asEnumerable<T>(enumerableOrArray: IEnumerableOrArray<T>): IEnumerable<T>
    {
        if (Array.isArray(enumerableOrArray))
        {
            // copy the array into this
            return new ArrayEnumerable([...enumerableOrArray]);
        }
        else
        {
            return enumerableOrArray;
        }
    }
}

export abstract class EnumerableBase<T> implements IEnumerable<T>
{
    public abstract getEnumerator(): IEnumerator<T>;

    public append(item: T): IEnumerable<T>
    {
        return this.concat(new ArrayEnumerable([item]));
    }

    public asQueryable(): IQueryable<T>
    {
        return new EnumerableQueryable(this);
    }

    public concat(next: IEnumerable<T>): IEnumerable<T>
    {
        return new EnumeratorEnumerable(new AppendEnumerator(this.getEnumerator(), next.getEnumerator()));
    }

    public contains(item: T): boolean
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

    public forEach(callback: (value: T, index: number) => boolean | void): void
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

    item(index: number): Undefinable<T>
    {
        const en = this.getEnumerator();
        let count = 0;
        while (count <= index && en.moveNext())
        {
            if (count === index)
            {
                return en.current;
            }
            count++;
        }

        return undefined;
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

export class EnumeratorEnumerable<T> extends EnumerableBase<T>
{
    private readonly _enumerator: IEnumerator<T>;

    constructor(enumerator: IEnumerator<T>)
    {
        super();
        this._enumerator = enumerator;
    }

    getEnumerator(): IEnumerator<T>
    {
        return this._enumerator;
    }
}

export class ArrayEnumerable<T> extends EnumerableBase<T>
{
    protected _array: T[];

    constructor(array: T[])
    {
        super();
        this._array = array;
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new ArrayEnumerator<T>(this._array);
    }
}

export class Collection<T> extends ArrayEnumerable<T> implements ICollection<T>, IEnumerable<T>
{
    constructor(enumerableOrArray?: IEnumerableOrArray<T>)
    {
        if (enumerableOrArray === undefined)
        {
            super([]);
        }
        else
        {
            super(Enumerable.asArray(enumerableOrArray));
        }
    }

    public get isReadOnly(): boolean
    {
        return false;
    }

    public add(obj: T): void
    {
        this._array.push(obj);
    }

    public get count(): number
    {
        return this._array.length;
    }

    public clear(): void
    {
        this._array.length = 0;
    }

    public copyTo(array: T[], arrayIndex: number): void
    {
        if (this.count > (array.length - arrayIndex))
        {
            throw new ArgumentException("array", "Array is not big enough to store the collection");
        }
        array.splice(arrayIndex, this.count, ...this._array);
    }

    public remove(item: T): boolean
    {
        let index = this._array.indexOf(item);

        if (index != undefined)
        {
            this._array.splice(index, 1);
            return true;
        }
        else
        {
            return false;
        }
    }
}

export class List<T> extends Collection<T> implements IList<T>, ICollection<T>, IEnumerable<T>
{
    public addRange(array: T[]): void;
    public addRange(enumerable: IEnumerable<T>): void;
    public addRange(enumerableOrArray: IEnumerableOrArray<T>): void
    {
        let array = Enumerable.asArray(enumerableOrArray);
        this._array = this._array.concat(array);
    }

    public find(obj: T, isEquivilent: boolean = false): T | undefined
    {
        if (isEquivilent)
        {
            for (let item of this._array)
            {
                var found = false;

                if (isEquivilent)
                {
                    found = Utilities.equals(item, obj);
                }
                if (found)
                {
                    return item;
                }
            }
        }
        else
        {
            let index = this.indexOf(obj);
            if (index !== undefined)
            {
                return this.item(index);
            }
            else
            {
                return undefined;
            }
        }
    }

    public indexOf(obj: T, isEquivilent: boolean = false): number | undefined
    {
        if (isEquivilent)
        {
            let index: number | undefined = undefined;

            this.forEach((item, i) =>
            {
                let found = false;

                if (isEquivilent)
                {
                    found = Utilities.equals(item, obj);
                }
                else
                {
                    found = item == obj;
                }
                if (found)
                {
                    index = i;
                    return false;
                }
            });

            return index;
        }
        else
        {
            let index = this._array.indexOf(obj);
            if (index == -1)
            {
                return undefined;
            }
            return index;
        }
    }

    public insert(obj: T, index: number): void
    {
        this._array.splice(index, 0, obj);
    }

    public prepend(obj: T): void
    public prepend(obj: T): IEnumerable<T>
    public prepend(obj: T): IEnumerable<T> | void
    {
        this.insert(obj, 0);
        return this;
    }

    public prependRange(array: T[]): void;
    public prependRange(enumerable: Collection<T>): void;
    public prependRange(enumerableOrArray: IEnumerableOrArray<T>): void
    {
        let array = Enumerable.asArray(enumerableOrArray);
        this._array.splice(0, 0, ...array);
    }

    public removeAt(index: number): void
    {
        this._array.splice(index, 1);
    }

    public sort(comparer: IComparer<T> = new DefaultComparer<T>()): void
    {
        this._array.sort((a, b) => comparer.compare(a, b));
    }
}

export class Dictionary<TKey, TValue> extends EnumerableBase<KeyValuePair<TKey, TValue>> implements IDictionary<TKey, TValue>, ICollection<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>
{
    private _hashtable: { [hash: string]: KeyValuePair<TKey, TValue> };

    public readonly isReadOnly: boolean = false;

    // constructor
    constructor(enumerableOrArray?: IEnumerableOrArray<KeyValuePair<TKey, TValue>>)
    {
        super();
        this._hashtable = {};

        if (enumerableOrArray)
        {
            const items = Enumerable.asArray(enumerableOrArray);
            for (let item of items)
            {
                this.add(item);
            }
        }
    }

    public get count(): number
    {
        return Object.keys(this._hashtable).length;
    }

    public get keys(): TKey[]
    {
        return Object.keys(this._hashtable).map(key => this._hashtable[key].key);
    }

    public get values(): TValue[]
    {
        return Object.keys(this._hashtable).map(key => this._hashtable[key].value);
    }

    public add(keyValuePair: KeyValuePair<TKey, TValue>): void
    {
        let hash = Utilities.getHash(keyValuePair.key);

        if (this._hashtable[Utilities.getHash(keyValuePair.key)] !== undefined)
        {
            throw new KeyAlreadyDefinedException(keyValuePair.key);
        }

        this._hashtable[hash] = keyValuePair;
    }

    public addKeyValue(key: TKey, value: TValue): void
    {
        this.add({ key: key, value: value });
    }

    public itemByKey(key: TKey): TValue
    {
        let hash = Utilities.getHash(key);
        if (this._hashtable[hash] === undefined)
        {
            throw new KeyNotFoundException(key);
        }
        return this._hashtable[hash].value;
    }

    public containsKey(key: TKey): boolean
    {
        let hash = Utilities.getHash(key);
        return this._hashtable[hash] !== undefined;
    }

    public removeByKey(key: TKey): boolean
    {
        let hash = Utilities.getHash(key);

        if (this._hashtable[hash] === undefined)
        {
            return false;
        }

        delete this._hashtable[hash];

        return true;
    }

    public tryGetValue(key: TKey): { value?: TValue; success: boolean; }
    {
        try
        {
            return {
                value: this.itemByKey(key),
                success: true
            }
        }
        catch
        {
            return { success: false }
        }
    }

    public clear(): void
    {
        this._hashtable = {};
    }

    public remove(item: KeyValuePair<TKey, TValue>): boolean
    {
        let hash = Utilities.getHash(item.key);
        if (this._hashtable[hash] === undefined || this._hashtable[hash].value !== item.value)
        {
            return false;
        }

        delete this._hashtable[hash];

        return true;
    }

    public contains(item: KeyValuePair<TKey, TValue>): boolean
    {
        let hash = Utilities.getHash(item.key);
        if (this._hashtable[hash] === undefined || this._hashtable[hash].value !== item.value)
        {
            return false;
        }

        return true;
    }

    public copyTo(array: KeyValuePair<TKey, TValue>[], arrayIndex: number): void
    {
        array.splice(arrayIndex, this.count, ...this.toArray());
    }

    public getEnumerator(): IEnumerator<KeyValuePair<TKey, TValue>>
    {
        return new DictionaryEnumerator(this);
    }
}

export class RangeEnumerable extends EnumerableBase<number>
{
    private readonly _start: number
    private readonly _count: number

    constructor(start: number, count: number)
    {
        super();
        this._start = start;
        this._count = count;
    }

    public getEnumerator(): IEnumerator<number>
    {
        return new RangeEnumerator(this._start, this._count);
    }
}

export class SelectEnumerable<T, TReturn> extends EnumerableBase<TReturn>
{
    private readonly _enumerable: IEnumerable<T>;
    private readonly _selector: Selector<T, TReturn>;

    constructor(enumerable: IEnumerable<T>, selector: Selector<T, TReturn>)
    {
        super();
        this._enumerable = enumerable;
        this._selector = selector;
    }

    public getEnumerator(): IEnumerator<TReturn>
    {
        return new SelectEnumerator<T, TReturn>(this._enumerable.getEnumerator(), this._selector);
    }
}

export class SkipEnumerable<T> extends EnumerableBase<T>
{
    private readonly _enumerable: IEnumerable<T>;
    private _itemsToSkip: number;

    constructor(enumerable: IEnumerable<T>, itemsToSkip: number)
    {
        super();
        this._enumerable = enumerable;
        this._itemsToSkip = itemsToSkip;
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new SkipEnumerator<T>(this._enumerable.getEnumerator(), this._itemsToSkip);
    }
}

export class TakeEnumerable<T> extends EnumerableBase<T>
{
    private readonly _enumerable: IEnumerable<T>;
    private _itemsToTake: number;

    constructor(enumerable: IEnumerable<T>, itemsToTake: number)
    {
        super();
        this._enumerable = enumerable;
        this._itemsToTake = itemsToTake;
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new TakeEnumerator<T>(this._enumerable.getEnumerator(), this._itemsToTake);
    }
}

export class WhereEnumerable<T> extends EnumerableBase<T>
{
    private readonly _enumerable: IEnumerable<T>;
    private readonly _predicate: Predicate<T>;

    constructor(enumerable: IEnumerable<T>, predicate: Predicate<T>)
    {
        super();
        this._enumerable = enumerable;
        this._predicate = predicate;
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new WhereEnumerator<T>(this._enumerable.getEnumerator(), this._predicate);
    }
}

export class AggregateEnumerable<T, TReturn> extends EnumerableBase<TReturn>
{
    private readonly _enumerable: IEnumerable<T>;
    private readonly _aggregateFunction: (acumulate: TReturn, current: T) => TReturn;

    constructor(enumerable: IEnumerable<T>, aggregateFunction: (acumulate: TReturn, current: T) => TReturn) 
    {
        super();
        this._enumerable = enumerable;
        this._aggregateFunction = aggregateFunction;
    }

    public getEnumerator(): IEnumerator<TReturn>
    {
        return new AggregateEnumerator(this._enumerable.getEnumerator(), this._aggregateFunction);
    }
}