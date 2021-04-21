import { Undefinable, ConstructorFor } from "@michaelcoxon/utilities";
import { IQueryable } from "../Interfaces/IQueryable";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { IList } from "../Interfaces/IList";
import { IDictionary } from "../Interfaces/IDictionary";
import AppendEnumerator from "../Enumerators/AppendEnumerator";
import ArrayEnumerator from "../Enumerators/ArrayEnumerator";
import Dictionary from "./Dictionary";
import List from "./List";
import ArrayEnumerable from "./ArrayEnumerable";
import EnumeratorEnumerable from "./EnumeratorEnumerable";


export default abstract class EnumerableBase<T> implements IEnumerable<T>
{
    [Symbol.iterator](): Iterator<T, any, undefined>
    {
        return this.getEnumerator();
    }
    public abstract getEnumerator(): IEnumerator<T>;

    public abstract asQueryable(): IQueryable<T>;

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
