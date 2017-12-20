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

    // casts each element to the new type
    //Cast: function (toType) {
    //
    //},


    // Clones the Collection object
    public clone(): Collection<T>
    {
        return new Collection<T>([...this._baseArray]);
    }

    public copy(into: Collection<T>): void
    {
        into._baseArray = [...this._baseArray];
    }

    // iterates over each item in the Collection. The this keyword is also the item but if 
    // it's a simple type it will be wrapped in an Object. Args are (index, value).
    public forEach(callback: (value: T, index: number) => boolean | void): void
    {
        var i = 0;
        for (i; i < this._baseArray.length; i++)
        {
            if (false === callback.call(this._baseArray[i], i, this._baseArray[i]))
            {
                break;
            }
        }
    }

    public item(index: number): T
    {
        return this._baseArray[index];
    }

    public ofType<N extends T>(type: { new(...args: any[]): N }): Collection<N>
    {
        return this.asQueryable().where((item) => item instanceof type).select((item) => item as N);
    }

    public toArray(): T[]
    {
        return [...this._baseArray];
    }
}



