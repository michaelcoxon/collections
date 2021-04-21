import { IEnumerable } from "../Interfaces/IEnumerable";
import { IEnumerableOrArray } from '../Types';
import RangeEnumerable from "./RangeEnumerable";
import ArrayEnumerable from "./ArrayEnumerable";


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
