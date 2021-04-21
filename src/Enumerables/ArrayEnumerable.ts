import { IEnumerator } from "../Interfaces/IEnumerator";
import EnumerableBase from "./EnumerableBase";
import ArrayEnumerator from "../Enumerators/ArrayEnumerator";
import EnumerableQueryable from "../Queryables/EnumerableQueryable";
import { IQueryable } from "../Interfaces/IQueryable";


export default class ArrayEnumerable<T> extends EnumerableBase<T>
{
    protected _array: T[];

    constructor(array: T[])
    {
        super();
        this._array = array;
    }

    public asQueryable(): IQueryable<T>
    {
        return new EnumerableQueryable(this);
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new ArrayEnumerator<T>(this._array);
    }
}
