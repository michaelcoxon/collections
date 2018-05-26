import { ICollection } from "./Interfaces/ICollection";
import { IEnumerable } from "./Interfaces/IEnumerable";
import { IEnumerableOrArray } from "./Types";
import { enumerableOrArrayToArray } from "./Utilities";
import { IQueryable } from "./Interfaces/IQueryable";
import { IEnumerator } from "./Interfaces/IEnumerator";
import { IDictionary } from "./Interfaces/IDictionary";
import { IList } from "./Interfaces/IList";
import { List } from "./List";
import { Dictionary } from "./Dictionary";
import { EnumerableEnumerator } from "./Enumerators/EnumerableEnumerator";
import { EnumerableQueryable } from "./Queryables/EnumerableQueryable";
import { Undefinable } from "@michaelcoxon/utilities";

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

        this._count++;
    }

    clear(): void
    {
        this._current = this._root = undefined;
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
        throw new Error("Method not implemented.");
    }

    remove(item: T): boolean
    {
        throw new Error("Method not implemented.");
    }

    asQueryable(): IQueryable<T>
    {
        return new EnumerableQueryable<T>(this);
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
        return new EnumerableEnumerator<T>(this);
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
        return this
            .asQueryable()
            .where((item) => item instanceof ctor).select((item) => item as N);
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

        return result
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