import { IEnumerable } from "./IEnumerable";
import { IEnumerator } from "./IEnumerator";
import { Enumerator } from "./Enumerator";



export class Enumerable<T> implements IEnumerable<T>
{
    asQueryable(): Queryable<T>
    {
        return new Queryable<T>(this);
    }

    // iterates over each item in the Collection. Return false to break.
    forEach(callback: (value: T, index: number) => boolean | void): void
    {
        for (let i = 0; i < this.count; i++)
        {
            if (false === callback(this.item(i), i))
            {
                break;
            }
        }
    }

    getEnumerator(): IEnumerator<T>
    {
        return new Enumerator<T>(this);
    }

    ofType<N extends T>(type: { new(...args: any[]): N }): Collection<N>
    {
        return this.asQueryable().where((item) => item instanceof type).select((item) => item as N);
    }

    Collection.prototype.toArray = function <T>(): T[]
    {
        let array: T[] = [];
        this.copyTo(array, 0);
        return array;
    }


    Collection.prototype.toList = function <T>(): List<T>
    {
        return new List<T>(this.toArray());
    }
}