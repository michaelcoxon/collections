import { IEnumerable } from "../Interfaces/IEnumerable";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { IList } from "../Interfaces/IList";
import { IDictionary } from "../Interfaces/IDictionary";
import { DefaultComparers } from "../Comparers/DefaultComparer";
import MapComparer from "../Comparers/MapComparer";
import ReverseComparer from "../Comparers/ReverseComparer";
import { IComparer } from "../Interfaces/IComparer";
import { IEnumerableGroup } from "../Interfaces/IEnumerableGroup";
import { IEnumerableOrArray, KeyValuePair } from "../Types";
import { ICollection } from "../Interfaces/ICollection";

import AppendEnumerator from "../Enumerators/AppendEnumerator";
import ArrayEnumerator from "../Enumerators/ArrayEnumerator";

import DictionaryEnumerator from "../Enumerators/DictionaryEnumerator";
import RangeEnumerator from "../Enumerators/RangeEnumerator";
import SelectEnumerator from "../Enumerators/SelectEnumerator";
import SelectManyEnumerator from "../Enumerators/SelectManyEnumerator";
import SkipEnumerator from "../Enumerators/SkipEnumerator";
import TakeEnumerator from "../Enumerators/TakeEnumerator";
import WhereEnumerator from "../Enumerators/WhereEnumerator";
import AggregateEnumerator from "../Enumerators/AggregateEnumerator";
import LinkedListEnumerator from "../Enumerators/LinkedListEnumerator";
import { Undefinable, Predicate, Selector, ConstructorFor } from "@michaelcoxon/utilities/lib/Types";
import { isUndefinedOrNull } from "@michaelcoxon/utilities/lib/TypeHelpers";
import ArgumentException from '@michaelcoxon/utilities/lib/Exceptions/ArgumentException';
import KeyAlreadyDefinedException from '@michaelcoxon/utilities/lib/Exceptions/KeyAlreadyDefinedException';
import KeyNotFoundException from '@michaelcoxon/utilities/lib/Exceptions/KeyNotFoundException';
import Utilities from '@michaelcoxon/utilities/lib/Utilities';
import NullReferenceException from '@michaelcoxon/utilities/lib/Exceptions/NullReferenceException';
import InvalidOperationException from '@michaelcoxon/utilities/lib/Exceptions/InvalidOperationException';

export default class Enumerable
{
    public static range(start: number, count: number): IEnumerable<number>
    {
        return new RangeEnumerable(start, count);
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


abstract class EnumerableBase<T> implements IEnumerable<T>
{
    [Symbol.iterator](): Iterator<T, any, undefined>
    {
        return this.getEnumerator();
    }
    public abstract getEnumerator(): IEnumerator<T>;

    public append(item: T): IEnumerable<T>
    {
        return this.concat(new ArrayEnumerable([item]));
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

    public item(index: number): Undefinable<T>
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

    public prepend(item: T): IEnumerable<T>
    {
        return new EnumeratorEnumerable(new AppendEnumerator(new ArrayEnumerator([item]), this.getEnumerator()));
    }

    public all(predicate: Predicate<T>): boolean
    {
        let output = true;
        const en = this.getEnumerator();

        while (output && en.moveNext())
        {
            output = predicate(en.current);
        }

        return output;
    }

    public any(predicate?: Predicate<T>): boolean
    {
        const en = this.getEnumerator();

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

    public average(selector: Selector<T, number>): number
    {
        let sum = this.sum(selector);
        return sum / this.count();
    }

    public count(): number
    {
        let itemCount = 0;
        const en = this.getEnumerator();
        while (en.moveNext())
        {
            itemCount++;
        }

        return itemCount;
    }

    // USAGE: obj.Distinct(); or obj.Distinct(['key1'],['key2']);
    public distinct<R>(selector: (a: T) => R): IEnumerable<T>
    {
        let temp: { [key: string]: boolean; } = {};

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
        let enumerable: IEnumerable<T> = this;

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
        let enumerable: IEnumerable<T> = this;

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

    public groupBy<TKey>(selector: Selector<T, TKey>): IEnumerable<IEnumerableGroup<T, TKey>>;
    public groupBy<TKey>(selector: Selector<T, TKey>, comparer: IComparer<TKey>): IEnumerable<IEnumerableGroup<T, TKey>>;
    public groupBy<TKey>(selector: Selector<T, TKey>, comparer: IComparer<TKey> = DefaultComparers.DefaultComparer): IEnumerable<IEnumerableGroup<T, TKey>>
    {
        let keySet = this.select(selector).distinct((k) => k).orderBy(k => k);
        return keySet.select((key) => new EnumerableGroup(this, key, selector, comparer));
    }
    /*
        public join<TInner, TKey, TResult>(
            inner: IEnumerable<TInner>,
            outerKeySelector: (o: T) => TKey,
            innerKeySelector: (i: TInner) => TKey,
            resultSelector: (o: T, i: TInner) => TResult): IEnumerable<TResult>
        {
            return this.select(o => ({ o, v: outerKeySelector(o) }))
                .selectMany(o => inner.select(i => ({ i, o: o.o, v: innerKeySelector(i) })).where(i => i.v == o.v))
                .select(j => resultSelector(j.o, j.i))
                ;
        }
    */
    public last(): T;
    public last(predicate: Predicate<T>): T;
    public last(predicate?: Predicate<T>): T 
    {
        let enumerable: IEnumerable<T> = this;

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
        let enumerable: IEnumerable<T> = this;

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

    public ofType<N extends T>(ctor: ConstructorFor<N>): IEnumerable<N>
    {
        return this.where((item) => item instanceof ctor).select((item) => item as N);
    }

    public orderBy<R>(selector: (a: T) => R, comparer?: IComparer<R>): IEnumerable<T>
    {
        return this.internalOrderBy(selector, comparer || DefaultComparers.DefaultComparer);
    }

    public orderByDescending<R>(selector: (a: T) => R, comparer?: IComparer<R>): IEnumerable<T>
    {
        return this.internalOrderBy(selector, new ReverseComparer(comparer || DefaultComparers.DefaultComparer));
    }

    public select<TOut>(selector: Selector<T, TOut>): IEnumerable<TOut>
    {
        return new SelectEnumerable<T, TOut>(this, selector);
    }

    public selectMany<TOut>(selector: Selector<T, IEnumerable<TOut>>): IEnumerable<TOut>
    {
        return new SelectManyEnumerable<T, TOut>(this, selector);
    }

    public single(): T;
    public single(predicate: Predicate<T>): T;
    public single(predicate?: Predicate<T>): T
    {
        let enumerable: IEnumerable<T> = this;

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
                throw new InvalidOperationException("More than one match in the collection!");
            }
            returnValue = en.current;
        }

        if (isUndefinedOrNull(returnValue))
        {
            throw new NullReferenceException("The result is undefined!");
        }

        return returnValue;
    }

    public singleOrDefault(): T | null;
    public singleOrDefault(predicate: Predicate<T>): T | null;
    public singleOrDefault(predicate?: Predicate<T>): T | null
    {
        let enumerable: IEnumerable<T> = this;

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
                // TODO: should this throw here?  throw new InvalidOperationException("More than one match in the collection!");
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

    public skip(count: number): IEnumerable<T>
    {
        return new SkipEnumerable(this, count);
    }

    public split(predicate: Predicate<T>): { pTrue: IEnumerable<T>, pFalse: IEnumerable<T>; }
    {
        return {
            pTrue: this.where(i => predicate(i)),
            pFalse: this.where(i => !predicate(i))
        };
    }

    public sum(selector: Selector<T, number>): number
    {
        return this.select((item) => selector(item))
            .toArray()
            .reduce((a, c) => a + c, 0);
    }

    public take(count: number): IEnumerable<T>
    {
        return new TakeEnumerable(this, count);
    }

    public where(predicate: Predicate<T>): IEnumerable<T>
    {
        return new WhereEnumerable(this, predicate);
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

    private internalOrderBy<R>(selector: (a: T) => R, comparer: IComparer<R>): IEnumerable<T>
    {
        // HACK: this could be better...
        const list = this.toList();
        const mapComparer = new MapComparer(selector, comparer);
        list.sort(mapComparer);
        return list;
    }
}

export class AggregateEnumerable<T, TReturn> extends EnumerableBase<TReturn>
{
    private readonly _enumerable: IEnumerable<T>;
    private readonly _aggregateFunction: (acumulate: TReturn, current: T) => TReturn;
    private readonly _initialValue: TReturn;

    constructor(enumerable: IEnumerable<T>, aggregateFunction: (acumulate: TReturn, current: T) => TReturn, initialValue: TReturn)
    {
        super();
        this._enumerable = enumerable;
        this._aggregateFunction = aggregateFunction;
        this._initialValue = initialValue;
    }

    public getEnumerator(): IEnumerator<TReturn>
    {
        return new AggregateEnumerator(this._enumerable.getEnumerator(), this._aggregateFunction, this._initialValue);
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

    public get length(): number
    {
        return this._array.length;
    }

    public clear(): void
    {
        this._array.length = 0;
    }

    public copyTo(array: T[], arrayIndex: number): void
    {
        if (this.length > (array.length - arrayIndex))
        {
            throw new ArgumentException("array", "Array is not big enough to store the collection");
        }
        array.splice(arrayIndex, this.length, ...this._array);
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

export class Dictionary<TKey, TValue> extends EnumerableBase<KeyValuePair<TKey, TValue>> implements IDictionary<TKey, TValue>, ICollection<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>
{
    private _hashtable: { [hash: string]: KeyValuePair<TKey, TValue>; };

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

    public get length(): number
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
            };
        }
        catch {
            return { success: false };
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
        array.splice(arrayIndex, this.length, ...this.toArray());
    }

    public getEnumerator(): IEnumerator<KeyValuePair<TKey, TValue>>
    {
        return new DictionaryEnumerator(this);
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

interface LinkedListItem<T>
{
    value: T;
    next?: LinkedListItem<T>;
}

export class LinkedList<T> extends EnumerableBase<T> implements ICollection<T>, IEnumerable<T>
{
    private _root?: LinkedListItem<T>;
    private _current?: LinkedListItem<T>;
    private _count: number;

    constructor(enumerableOrArray?: IEnumerableOrArray<T>)
    {
        super();

        this._count = 0;

        if (enumerableOrArray)
        {
            for (var item of Enumerable.asArray(enumerableOrArray))
            {
                this.add(item);
            }
        }
    }

    append(item: T): IEnumerable<T>
    {
        return this.concat(new ArrayEnumerable([item]));
    }

    concat(next: IEnumerable<T>): IEnumerable<T>
    {
        return new EnumeratorEnumerable(new AppendEnumerator(this.getEnumerator(), next.getEnumerator()));
    }

    prepend(item: T): IEnumerable<T>
    {
        return new ArrayEnumerable([item]).concat(this);
    }

    public get length(): number
    {
        return this._count;
    }

    public get isReadOnly(): boolean
    {
        return false;
    }

    add(item: T): void
    {
        const listItem: LinkedListItem<T> = {
            value: item
        };

        if (this._current === undefined)
        {
            this._current = this._root = listItem;
        }
        else
        {
            this._current.next = listItem;
            this._current = listItem;
        }

        this._count++;
    }

    clear(): void
    {
        this._current = this._root = undefined;
        this._count = 0;
    }

    contains(item: T): boolean
    {
        if (this._root === undefined)
        {
            return false;
        }

        let result = false;

        this.traverse(this._root, node => !(result = (node.value === item)));

        return result;
    }

    copyTo(array: T[], arrayIndex: number): void
    {
        // TODO:   throw new Error("Method not implemented.");
        throw new Error("Method not implemented.");
    }

    remove(item: T): boolean
    {
        // TODO:   throw new Error("Method not implemented.");
        throw new Error("Method not implemented.");
    }

    forEach(callback: (value: T, index: number) => boolean | void): void
    {
        let index = 0;

        if (this._root === undefined)
        {
            return;
        }

        return this.traverse(this._root, node => callback(node.value, index++));
    }

    getEnumerator(): IEnumerator<T>
    {
        return new LinkedListEnumerator<T>(this);
    }

    item(index: number): Undefinable<T>
    {
        if (this._root !== undefined)
        {
            if (index == 0)
            {
                return this._root.value;
            }

            let count = 0;
            let result: Undefinable<T>;

            this.traverse(this._root, node =>
            {
                if (count == index)
                {
                    result = node.value;
                }
                count++;
            });

            return result;
        }
        else
        {
            return undefined;
        }
    }

    ofType<N extends T>(ctor: new (...args: any[]) => N): IEnumerable<N>
    {
        return this.where((item) => item instanceof ctor).select((item) => item as N);
    }

    toArray(): T[]
    {
        const result: T[] = [];
        const en = this.getEnumerator();
        let index = 0;

        while (en.moveNext())
        {
            result.push(en.current);
        }

        return result;
    }

    toDictionary<TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): IDictionary<TKey, TValue>
    {
        return new Dictionary(this.toArray().map(i => ({ key: keySelector(i), value: valueSelector(i) })));
    }

    toList(): IList<T>
    {
        return new List(this);
    }

    /**
     * Traverse the collection, return false in the callback to break. return true or undefined to continue.
     * @param node
     * @param callback
     */
    private traverse(node: LinkedListItem<T>, callback: ((node: LinkedListItem<T>) => boolean | void)): void
    {
        const cont = callback(node);

        if (cont !== false && node.next !== undefined)
        {
            return this.traverse(node.next, callback);
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
                if (Utilities.equals(item, obj))
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

    public indexOf(value: T, isEquivilent: boolean = false): number | undefined
    {
        if (isEquivilent)
        {
            let index: number | undefined = undefined;

            this.forEach((item, i) =>
            {
                if (Utilities.equals(item, value))
                {
                    index = i;
                    return false;
                }
            });

            return index;
        }
        else
        {
            let index = this._array.indexOf(value);
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

    public prepend(obj: T): void;
    public prepend(obj: T): IEnumerable<T>;
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

    public sort(comparer: IComparer<T> = DefaultComparers.DefaultComparer): void
    {
        this._array.sort((a, b) => comparer.compare(a, b));
    }
}

class EnumerableGroup<T, TKey> extends EnumerableBase<T> implements IEnumerableGroup<T, TKey>
{
    private readonly _key: TKey;
    private readonly _enumerable: IEnumerable<T>;

    constructor(parentEnumerable: IEnumerable<T>, key: TKey, keySelector: Selector<T, TKey>, keyComparer: IComparer<TKey>)
    {
        super();
        this._enumerable = parentEnumerable.where(item => keyComparer.equals(keySelector(item), key));
        this._key = key;
    }

    public get key(): TKey 
    {
        return this._key;
    }

    public getEnumerator(): IEnumerator<T>
    {
        return this._enumerable.getEnumerator();
    }
}

class RangeEnumerable extends EnumerableBase<number>
{
    private readonly _start: number;
    private readonly _count: number;

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

class SelectEnumerable<T, TReturn> extends EnumerableBase<TReturn>
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

class SelectManyEnumerable<T, TReturn> extends EnumerableBase<TReturn>
{
    private readonly _enumerable: IEnumerable<T>;
    private readonly _selector: Selector<T, IEnumerable<TReturn>>;

    constructor(enumerable: IEnumerable<T>, selector: Selector<T, IEnumerable<TReturn>>)
    {
        super();
        this._enumerable = enumerable;
        this._selector = selector;
    }

    public getEnumerator(): IEnumerator<TReturn>
    {
        return new SelectManyEnumerator<T, TReturn>(this._enumerable.getEnumerator(), this._selector);
    }
}

class SkipEnumerable<T> extends EnumerableBase<T>
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

class TakeEnumerable<T> extends EnumerableBase<T>
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

class WhereEnumerable<T> extends EnumerableBase<T>
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