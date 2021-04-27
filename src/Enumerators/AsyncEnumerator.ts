import { IAsyncEnumerator } from "../Interfaces/IEnumerator";
import { Promisable } from "@michaelcoxon/utilities/lib/Types";
import { isUndefinedOrNull } from "@michaelcoxon/utilities/lib/TypeHelpers";
import OutOfBoundsException from '@michaelcoxon/utilities/lib/Exceptions/OutOfBoundsException';


export default class AsyncEnumerator<T> implements IAsyncEnumerator<T>
{
    // the internal array
    private readonly _baseArray: Promisable<T>[];

    // current pointer location
    private _pointer: number = -1;
    private _current?: T;

    constructor(array: Promisable<T>[])
    {
        this._baseArray = array;
    }

    // returns the current element
    public get current(): T
    {
        if (!isUndefinedOrNull(this._current) && this._pointer < this._baseArray.length && this._pointer >= 0)
        {
            return this._current;
        }
        throw new OutOfBoundsException("internal pointer", 0, this._baseArray.length - 1);
    }

    public async moveNextAsync(): Promise<boolean>
    {
        if (this._pointer < this._baseArray.length)
        {
            this._pointer++;
        }

        if (this._pointer < this._baseArray.length)
        {
            this._current = await this._baseArray[this._pointer];
            return true;
        }

        else
        {
            this._current = undefined;
            return false;
        }
    }
}
