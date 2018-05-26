import { Selector, Undefinable } from "@michaelcoxon/utilities";
import { Enumerable } from "./Enumerable";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { EnumerableEnumerator } from "../Enumerators/EnumerableEnumerator";
import { IQueryable } from "../Interfaces/IQueryable";
import { EnumerableQueryable } from "../Queryables/EnumerableQueryable";
import { Dictionary } from "../Dictionary";
import { IList } from "../Interfaces/IList";
import { List } from "../List";
import { IDictionary } from "../Interfaces/IDictionary";

export class SelectEnumerable<T, TReturn> implements IEnumerable<TReturn>
{
    private readonly _enumerable: IEnumerable<T>;
    private readonly _selector: Selector<T, TReturn>;

    constructor(enumerable: IEnumerable<T>, selector: Selector<T, TReturn>)
    {
        this._enumerable = enumerable;
        this._selector = selector;
    }

    public asQueryable(): IQueryable<TReturn>
    {
        return new EnumerableQueryable<TReturn>(this);
    }

    // iterates over each item in the Collection. Return false to break.
    public forEach(callback: (value: TReturn, index: number) => boolean | void): void
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

    public getEnumerator(): IEnumerator<TReturn>
    {
        return new EnumerableEnumerator<TReturn>(this);
    }

    public item(index: number): Undefinable<TReturn>
    {
        const item = this._enumerable.item(index);

        if (item === undefined)
        {
            return undefined;
        }

        return this._selector(item);
    }

    public ofType<N extends TReturn>(type: { new(...args: any[]): N }): IEnumerable<N>
    {
        return this
            .asQueryable()
            .where((item) => item instanceof type).select((item) => item as N);
    }

    public toArray(): TReturn[]
    {
        const result: TReturn[] = [];
        const en = this.getEnumerator();
        let index = 0;

        while (en.moveNext())
        {
            result.push(en.current);
        }

        return result
    }

    public toDictionary<TKey, TValue>(keySelector: (a: TReturn) => TKey, valueSelector: (a: TReturn) => TValue): IDictionary<TKey, TValue>
    {
        return new Dictionary(this.asQueryable().select(i => ({ key: keySelector(i), value: valueSelector(i) })));
    }

    public toList(): IList<TReturn>
    {
        return new List<TReturn>(this);
    }
}