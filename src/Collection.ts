import { InvalidTypeException } from './Exceptions';

export type CollectionOrArray<T> = T[] | Collection<T>;

export class Collection<T>
{
    // the internal array
    protected _baseArray: T[];

    // constructor
    constructor(collectionOrArray?: CollectionOrArray<T>)
    {
        if (collectionOrArray === undefined)
        {
            this._baseArray = [];
        }
        else if (Array.isArray(collectionOrArray))
        {
            // copy the array into this
            this._baseArray = collectionOrArray;
        }
        else if (collectionOrArray instanceof Collection)
        {
            this._baseArray = collectionOrArray.toArray();
        }
        else
        {
            throw new InvalidTypeException('collectionOrArray', 'Collection or Array');
        }
    }

    public get count(): number
    {
        return this._baseArray.length;
    }

    // Clones the Collection object
    public clone(): Collection<T>
    {
        return new Collection<T>([...this._baseArray]);
    }

    public copyTo(into: Collection<T>): void
    {
        into._baseArray.push(...this._baseArray);
    }

    // iterates over each item in the Collection. Return false to break.
    public forEach(callback: (value: T, index: number) => boolean | void): void
    {
        for (let i = 0; i < this._baseArray.length; i++)
        {
            if (false === callback(this._baseArray[i], i))
            {
                break;
            }
        }
    }

    public item(index: number): T
    {
        return this._baseArray[index];
    }

    public toArray(): T[]
    {
        return [...this._baseArray];
    }
}