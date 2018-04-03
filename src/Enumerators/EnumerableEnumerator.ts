import { IEnumerator } from "../Interfaces/IEnumerator";
import { IEnumerable } from "../Interfaces/IEnumerable";




export class EnumerableEnumerator<T> implements IEnumerator<T>
{
    private readonly _enumerable: IEnumerable<T>;

    private _currentIndex: number;

    constructor(enumerable: IEnumerable<T>)
    {
        this._enumerable = enumerable;
        this._currentIndex = -1;
    }

    public get current(): T
    {
        return this._enumerable.item(this._currentIndex);
    }

    public moveNext(): boolean
    {
        try
        {
            this.peek();
            this._currentIndex++;
            return true;
        }
        catch
        {
            return false;
        }
    }

    public peek(): T
    {
        return this._enumerable.item(this._currentIndex + 1);
    }

    public reset(): void
    {
        this._currentIndex = -1;
    }
}