import { IEnumerator } from "../Interfaces/IEnumerator";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { Exception } from "@michaelcoxon/utilities";




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
        return this._enumerable.item(this._currentIndex)!;
    }

    public moveNext(): boolean
    {
        try
        {
            const item = this.peek();

            if (item === undefined)
            {
                return false;
            }

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
        const item = this._enumerable.item(this._currentIndex + 1);

        if (item === undefined)
        {
            throw new Exception("End of enumerator");
        }

        return item;
    }

    public reset(): void
    {
        this._currentIndex = -1;
    }
}