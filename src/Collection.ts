import { InvalidTypeException, ArgumentUndefinedException } from '@michaelcoxon/utilities';
import { ICollection } from './ICollection';
import { IEnumerableOrArray } from './Types';
import { enumerableOrArrayToArray } from './Utilities';
import { IEnumerable } from './IEnumerable';
import { EnumerableArray } from './Enumerables/EnumerableArray';

export class Collection<T> extends EnumerableArray<T> implements ICollection<T>, IEnumerable<T>
{
    constructor(enumerableOrArray?: IEnumerableOrArray<T>)
    {
        if (enumerableOrArray === undefined)
        {
            super([]);
        }
        else
        {
            super(enumerableOrArrayToArray(enumerableOrArray));
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

    public copyTo(array: T[], arrayIndex: number): void
    {
        array.splice(arrayIndex, this.count, ...this._baseArray);
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