import { IEnumerator } from "../Interfaces/IEnumerator";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { NullReferenceException, Predicate, Undefinable } from "@michaelcoxon/utilities";
import { EnumerableEnumerator } from "../Enumerators/EnumerableEnumerator";
import { EnumerableQueryable } from "../Queryables/EnumerableQueryable";
import { IQueryable } from "../Interfaces/IQueryable";
import { Dictionary } from "../Dictionary";
import { IList } from "../Interfaces/IList";
import { List } from "../List";
import { IDictionary } from "../Interfaces/IDictionary";



export class TakeEnumerable<T> implements IEnumerable<T>
{
    private readonly _enumerable: IEnumerable<T>;
    private _itemsToTake: number;

    constructor(enumerable: IEnumerable<T>, itemsToTake: number)
    {
        this._enumerable = enumerable;
        this._itemsToTake = itemsToTake;
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
        if (index < this._itemsToTake)
        {
            return this._enumerable.item(index);
        }
        else
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
