import { Collection, CollectionOrArray } from './Collection';
import { InvalidTypeException, OutOfBoundsException } from "./Exceptions";

export class Enumerator<T>
{
    // the internal array
    private readonly _baseArray: T[];

    // current pointer location
    private _pointer: number = -1;

    constructor(collectionOrArray: CollectionOrArray<T>)
    {
        if (Array.isArray(collectionOrArray))
        {
            // copy the array into this
            this._baseArray = [...collectionOrArray];
        }
        else if (collectionOrArray instanceof Collection)
        {
            this._baseArray = [...collectionOrArray.toArray()];
        }
        else
        {
            throw new InvalidTypeException('collectionOrArray', 'Collection or Array');
        }
    }

    // returns the current element
    public get current(): T
    {
        return this._baseArray[this._pointer];
    }

    public moveNext(): boolean
    {
        this._pointer++;
        return this._pointer < this._baseArray.length;
    }

    // returns the next element without moving the pointer forwards
    public peek(): T
    {
        if (this._pointer >= this._baseArray.length)
        {
            throw new OutOfBoundsException("internal pointer", 0, this._baseArray.length - 1);
        }
        return this._baseArray[this._pointer + 1];
    }

    // reset the pointer to the start
    public reset(): void
    {
        this._pointer = -1;
    }
}

declare module "./Collection" {
    interface Collection<T>
    {
        // returns an Enumerator for the current Collection
        getEnumerator(): Enumerator<T>;
    }
}

Collection.prototype.getEnumerator = function <T>(): Enumerator<T>
{
    return new Enumerator<T>(this);
}