import { IEnumerable } from "./Interfaces/IEnumerable";
import { IEnumerableOrArray } from "./Types";
import { ArrayEnumerable } from "./Enumerables/ArrayEnumerable";


export namespace Enumerable
{
    export function create<T>(enumerableOrArray: IEnumerableOrArray<T>): IEnumerable<T>
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