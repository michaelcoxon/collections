import TakeEnumerator from "../Enumerators/TakeEnumerator";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { IQueryable } from "../Interfaces/IQueryable";
import EnumerableQueryable from "../Queryables/EnumerableQueryable";
import EnumerableBase from "./EnumerableBase";


export default class TakeEnumerable<T> extends EnumerableBase<T>
{
    private readonly _enumerable: IEnumerable<T>;
    private _itemsToTake: number;

    constructor(enumerable: IEnumerable<T>, itemsToTake: number)
    {
        super();
        this._enumerable = enumerable;
        this._itemsToTake = itemsToTake;
    }

    public asQueryable(): IQueryable<T>
    {
        return new EnumerableQueryable(this);
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new TakeEnumerator<T>(this._enumerable.getEnumerator(), this._itemsToTake);
    }
}
