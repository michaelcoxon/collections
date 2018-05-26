import { Collection } from '../Collection';
import { OutOfBoundsException } from "@michaelcoxon/utilities";
import { IEnumerator } from '../Interfaces/IEnumerator';

export class ArrayEnumerator<T> implements IEnumerator<T>
{
    // the internal array
    private readonly _baseArray: T[];

    // current pointer location
    private _pointer: number = -1;

    constructor(array: T[])
    {
        this._baseArray = array;
    }

    // returns the current element
    public get current(): T
    {
        if (this._pointer >= this._baseArray.length || this._pointer < 0)
        {
            this.throwOutOfBoundsException();
        }
        return this._baseArray[this._pointer];
    }

    public moveNext(): boolean
    {
        if (this._pointer < this._baseArray.length)
        {
            this._pointer++;
        }
        return this._pointer < this._baseArray.length
    }

    // returns the next element without moving the pointer forwards
    public peek(): T
    {
        if (this._pointer + 1 >= this._baseArray.length)
        {
            this.throwOutOfBoundsException();
        }
        return this._baseArray[this._pointer + 1];
    }

    // reset the pointer to the start
    public reset(): void
    {
        this._pointer = -1;
    }

    private throwOutOfBoundsException(): void
    {
        throw new OutOfBoundsException("internal pointer", 0, this._baseArray.length - 1);
    }
}
