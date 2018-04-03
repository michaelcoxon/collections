import { IComparer } from "../IComparer";

export class ReverseComparer<T> implements IComparer<T>
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
}
