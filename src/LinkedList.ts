import { ICollection } from "./Interfaces/ICollection";
import { IEnumerable } from "./Interfaces/IEnumerable";
import { IReadOnlyCollection } from "./Interfaces/IReadOnlyCollection";
import { IEnumerableOrArray } from "./Types";
import { enumerableOrArrayToArray } from "./Utilities";
import { IList } from "./IList";
import { IEnumerator } from "./Interfaces/IEnumerator";
import { IQueryable } from "./Interfaces/IQueryable";
import { IDictionary } from "./Interfaces/IDictionary";

interface LinkedListItem<T>
{
    value: T;
    next?: LinkedListItem<T>;
}

export class LinkedList<T> implements ICollection<T>, IEnumerable<T>
{
    private _root?: LinkedListItem<T>;
    private _current?: LinkedListItem<T>;
    private _count: number;

    constructor(enumerableOrArray?: IEnumerableOrArray<T>)
    {
        this._count = 0;

        if (enumerableOrArray)
        {
            for (var item of enumerableOrArrayToArray(enumerableOrArray))
            {
                this.add(item);
            }
        }
    }

    public get count(): number
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
    }

    clear(): void
    {
        this._current = this._root = undefined;
    }

    contains(item: T): boolean
    {
        throw new Error("Method not implemented.");
    }

    copyTo(array: T[], arrayIndex: number): void
    {
        throw new Error("Method not implemented.");
    }

    remove(item: T): boolean
    {
        throw new Error("Method not implemented.");
    }

    asQueryable(): IQueryable<T>
    {
        throw new Error("Method not implemented.");
    }

    forEach(callback: (value: T, index: number) => boolean | void): void
    {
        throw new Error("Method not implemented.");
    }

    getEnumerator(): IEnumerator<T>
    {
        throw new Error("Method not implemented.");
    }

    item(index: number): T
    {
        throw new Error("Method not implemented.");
    }

    ofType<N extends T>(ctor: new (...args: any[]) => N): IEnumerable<N>
    {
        throw new Error("Method not implemented.");
    }

    toArray(): T[]
    {
        throw new Error("Method not implemented.");
    }

    toDictionary<TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): IDictionary<TKey, TValue>
    {
        throw new Error("Method not implemented.");
    }

    toList(): IList<T>
    {
        throw new Error("Method not implemented.");
    }

    private traverse(node: LinkedListItem<T>, callback: ((node: LinkedListItem<T>) => boolean | undefined)): void
    {
        throw new Error("Method not implemented.");
    }
}