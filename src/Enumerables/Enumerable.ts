import { List } from "../List";
import { Dictionary } from "../Dictionary";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { IQueryable } from "../Interfaces/IQueryable";
import { EnumerableQueryable } from "../Queryables/EnumerableQueryable";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { EnumerableEnumerator } from "../Enumerators/EnumerableEnumerator";
import { IDictionary } from "../Interfaces/IDictionary";
import { IList } from "../Interfaces/IList";
import { Undefinable } from "@michaelcoxon/utilities";



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
}