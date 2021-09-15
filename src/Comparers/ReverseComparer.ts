import { IComparer } from "../Interfaces/IComparer";
import { IEqualityComparer } from '../Interfaces/IEqualityComparer';

/** reverses the comparer provided */
export default class ReverseComparer<T> implements IComparer<T>, IEqualityComparer<T>
{
    private readonly _comparer: IComparer<T>;

    constructor(comparer: IComparer<T>)
    {
        this._comparer = comparer;
    }

    public compare(x: T, y: T): number
    {
        return this._comparer.compare(y, x);
    }

    public equals(x: T, y: T): boolean
    {
        return this._comparer.equals(y, x);
    }

    public greaterThan(x: T, y: T): boolean
    {
        return this._comparer.greaterThan(y, x);
    }

    public greaterThanOrEqual(x: T, y: T): boolean
    {
        return this._comparer.greaterThanOrEqual(y, x);
    }

    public lessThan(x: T, y: T): boolean
    {
        return this._comparer.lessThan(y, x);
    }

    public lessThanOrEqual(x: T, y: T): boolean
    {
        return this._comparer.lessThanOrEqual(y, x);
    }
}
