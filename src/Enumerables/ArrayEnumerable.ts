import { IEnumerable } from "../Interfaces/IEnumerable";
import { IQueryable } from "../Interfaces/IQueryable";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { ArrayEnumerator } from "../Enumerators/ArrayEnumerator";
import { Undefinable } from "@michaelcoxon/utilities";
import { Dictionary } from "../Dictionary";
import { IList } from "../Interfaces/IList";
import { List } from "../List";
import { IDictionary } from "../Interfaces/IDictionary";
import { EnumerableQueryable } from "../Queryables/EnumerableQueryable";

export class ArrayEnumerable<T> implements IEnumerable<T>
{
    protected _baseArray: T[];

    constructor(array: T[])
    {
        this._baseArray = array;
    }

    public asQueryable(): IQueryable<T>
    {
        return new EnumerableQueryable<T>(this);
    }

    // iterates over each item in the Collection. Return false to break.
    public forEach(callback: (value: T, index: number) => boolean | void): void
    {
        for (let i = 0; i < this._baseArray.length; i++)
        {
            if (false === callback(this._baseArray[i], i))
            {
                break;
            }
        }
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new ArrayEnumerator<T>(this._baseArray);
    }

    public item(index: number): Undefinable<T>
    {
        try
        {
            return this._baseArray[index];
        }
        catch
        {
            return undefined;
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
        return [...this._baseArray];
    }

    public toDictionary<TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): IDictionary<TKey, TValue>
    {
        return new Dictionary(this.toArray().map(i => ({ key: keySelector(i), value: valueSelector(i) })));
    }

    public toList(): IList<T>
    {
        return new List<T>(this);
    }
}