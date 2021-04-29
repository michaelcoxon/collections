import { IComparer } from "../Interfaces/IComparer";
import { IEqualityComparer } from '../Interfaces/IEqualityComparer';

/**
 * Compares objects of the same type using a custom selector and 
 * a comparer for the selector's return value.
 */
export default class MapComparer<T, TProperty> implements IComparer<T>, IEqualityComparer<T>
{
    private readonly _selector: (a: T) => TProperty;
    private readonly _comparer: IComparer<TProperty>;

    constructor(selector: (a: T) => TProperty,comparer: IComparer<TProperty>)
    {
        this._selector = selector;
        this._comparer = comparer;
    }

    public compare(x: T, y: T): number
    {
        let x_value = this._selector(x);
        let y_value = this._selector(y);

        return this._comparer.compare(x_value, y_value);
    }

    public equals(x: T, y: T): boolean
    {
        let x_value = this._selector(x);
        let y_value = this._selector(y);

        return this._comparer.equals(x_value, y_value);
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
