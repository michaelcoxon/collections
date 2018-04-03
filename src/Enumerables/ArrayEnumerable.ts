import { IEnumerable } from "../IEnumerable";
import { IQueryable } from "../IQueryable";
import { ArrayQueryable } from "../Queryables/QueryableArray";
import { IEnumerator } from "../IEnumerator";
import { ArrayEnumerator } from "../Enumerators/ArrayEnumerator";
import { IList } from "../IList";
import { List } from "../List";
import { Dictionary } from "../Dictionary";
import { IDictionary, KeyValuePair } from "../IDictionary";



export class ArrayEnumerable<T> implements IEnumerable<T>
{
    protected _baseArray: T[];

    constructor(array: T[])
    {
        this._baseArray = array;
    }

    public asQueryable(): IQueryable<T>
    {
        return new ArrayQueryable<T>(this._baseArray);
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

    public item(index: number): T
    {
        return this._baseArray[index];
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
        return new Dictionary(this.toArray().map(i =>
        {
            return {
                key: keySelector(i),
                value: valueSelector(i)
            }
        }));
    }

    public toList(): IList<T>
    {
        return new List<T>(this);
    }
}