import { ArgumentException } from "@michaelcoxon/utilities";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { ICollection } from '../Interfaces/ICollection';
import { IEnumerableOrArray } from '../Types';
import Enumerable from "./Enumerable";
import ArrayEnumerable from "./ArrayEnumerable";


export default class Collection<T> extends ArrayEnumerable<T> implements ICollection<T>, IEnumerable<T>
{
    constructor(enumerableOrArray?: IEnumerableOrArray<T>)
    {
        if (enumerableOrArray === undefined)
        {
            super([]);
        }

        else
        {
            super(Enumerable.asArray(enumerableOrArray));
        }
    }

    public get isReadOnly(): boolean
    {
        return false;
    }

    public add(obj: T): void
    {
        this._array.push(obj);
    }

    public get count(): number
    {
        return this._array.length;
    }

    public clear(): void
    {
        this._array.length = 0;
    }

    public copyTo(array: T[], arrayIndex: number): void
    {
        if (this.count > (array.length - arrayIndex))
        {
            throw new ArgumentException("array", "Array is not big enough to store the collection");
        }
        array.splice(arrayIndex, this.count, ...this._array);
    }

    public remove(item: T): boolean
    {
        let index = this._array.indexOf(item);

        if (index != undefined)
        {
            this._array.splice(index, 1);
            return true;
        }

        else
        {
            return false;
        }
    }
}
