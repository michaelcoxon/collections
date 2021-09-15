import ArgumentException from '@michaelcoxon/utilities/lib/Exceptions/ArgumentException';
import ArgumentUndefinedException from '@michaelcoxon/utilities/lib/Exceptions/ArgumentUndefinedException';
import { isUndefinedOrNull } from '@michaelcoxon/utilities/lib/TypeHelpers';
import { IComparer } from "../Interfaces/IComparer";
import { IEqualityComparer } from "../Interfaces/IEqualityComparer";

export default class CustomComparer<T> implements IComparer<T>, IEqualityComparer<T>
{
    private readonly _comparer?: (a: T, b: T) => number;
    private readonly _equalityComparer?: (x: T, y: T) => boolean;

    constructor(comparer?: (a: T, b: T) => number, equalityComparer?: (x: T, y: T) => boolean)
    {
        if (isUndefinedOrNull(comparer) && isUndefinedOrNull(equalityComparer))
        {
            throw new ArgumentException("You must provide at least one argument.");
        }
        this._comparer = comparer;
        this._equalityComparer = equalityComparer;
    }

    public compare(x: T, y: T): number
    {
        if (this._comparer)
        {
            return this._comparer(x, y);
        }
        else
        {
            throw new ArgumentUndefinedException("The comparer");
        }
    }

    public equals(x: T, y: T): boolean
    {
        if (this._equalityComparer)
        {
            return this._equalityComparer(x, y);
        }
        else
        {
            throw new ArgumentUndefinedException("The equality comparer");
        }
    }

    public greaterThan(x: T, y: T): boolean
    {
        return this.compare(x, y) > 0;
    }

    public greaterThanOrEqual(x: T, y: T): boolean
    {
        return this.compare(x, y) >= 0;
    }

    public lessThan(x: T, y: T): boolean
    {
        return this.compare(x, y) < 0;
    }

    public lessThanOrEqual(x: T, y: T): boolean
    {
        return this.compare(x, y) <= 0;
    }
}
