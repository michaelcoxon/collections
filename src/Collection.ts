import { InvalidTypeException, ArgumentUndefinedException } from '@michaelcoxon/utilities';
import { ICollection } from './ICollection';

export class Collection<T> implements ICollection<T>
{
    // the internal array
    protected _baseArray: T[];

    // constructor
    constructor(collectionOrArray?: EnumerableOrArray<T>)
    {
        if (collectionOrArray === undefined)
        {
            this._baseArray = [];
        }
        else
        {
            this._baseArray = Collection.collectionOrArrayToArray(collectionOrArray);
        }
    }

    public get count(): number
    {
        return this._baseArray.length;
    }

    public get isReadOnly(): boolean
    {
        return false;
    }

    public add(obj: T): void
    {
        this._baseArray.push(obj);
    }


    public clear(): void
    {
        this._baseArray.length = 0;
    }


    // Clones the Collection object
    public clone(): Collection<T>
    {
        return new Collection<T>([...this._baseArray]);
    }

    public contains(obj: T): boolean
    {
        return this._baseArray.indexOf(obj) != -1;
    }

    public copyTo(collectionOrArray: EnumerableOrArray<T>, collectionOrArrayIndex: number): void
    {
        let array: T[];
        if (Array.isArray(collectionOrArray))
        {
            array = collectionOrArray;
        }
        else
        {
            array = [];
            collectionOrArray.copyTo(array, 0);
        }

        array.splice(collectionOrArrayIndex, this.count, ...this._baseArray);
    }

    public remove(item: T): boolean
    {
        let index = this._baseArray.indexOf(item);

        if (index != undefined)
        {
            this.removeAt(index);
            return true;
        }
        else
        {
            return false;
        }
    }

    public removeAt(index: number): void
    {
        this._baseArray.splice(index, 1);
    }
}