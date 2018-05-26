import { IComparer } from "../Interfaces/IComparer";

export class MapComparer<T, M> implements IComparer<T>
{
    private readonly _comparer: IComparer<M>;
    private readonly _selector: (a: T) => M;

    constructor(comparer: IComparer<M>, selector: (a: T) => M)
    {
        this._comparer = comparer;
        this._selector = selector;
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
}
