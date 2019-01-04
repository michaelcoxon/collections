import { IComparer } from "../Interfaces/IComparer";
import { IEqualityComparer } from '../Interfaces/IEqualityComparer';

export class ReverseComparer<T> implements IComparer<T>, IEqualityComparer<T>
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
