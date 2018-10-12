import { NotSupportedException, Selector } from "@michaelcoxon/utilities";
import { ArrayEnumerable } from "./BaseCollections";
import { IEnumerable } from "./Interfaces/IEnumerable";
import { IEnumerableOrArray } from "./Types";


export function enumerableOrArrayToArray<T>(enumerableOrArray: IEnumerableOrArray<T>): T[]
{
    if (Array.isArray(enumerableOrArray))
    {
        // copy the array into this
        return [...enumerableOrArray];
    }
    else
    {
        return [...enumerableOrArray.toArray()];
    }
}

export function createSelector<T, K extends keyof T, R>(propertyNameOrSelector: K | Selector<T, R>): Selector<T, R | T[K]>
{
    if (typeof propertyNameOrSelector === 'string')
    {
        return (a: T) =>
        {
            if (typeof a[propertyNameOrSelector] === 'function')
            {
                throw new NotSupportedException(`property names that are functions ('${propertyNameOrSelector}')`);
            }
            return a[propertyNameOrSelector];
        }
    }
    else
    {
        return propertyNameOrSelector as (a: T) => R;
    }
}

export function createEnumerable<T>(enumerableOrArray: IEnumerableOrArray<T>): IEnumerable<T>
{
    if (Array.isArray(enumerableOrArray))
    {
        // copy the array into this
        return new ArrayEnumerable(enumerableOrArray);
    }
    else
    {
        return enumerableOrArray;
    }
}
