import NotSupportedException from '@michaelcoxon/utilities/lib/Exceptions/NotSupportedException';
import { Selector } from "@michaelcoxon/utilities/lib/Types";

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
        };
    }
    else
    {
        return propertyNameOrSelector as (a: T) => R;
    }
}
