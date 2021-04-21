import SkipEnumerator from "../Enumerators/SkipEnumerator";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { IQueryable } from "../Interfaces/IQueryable";
import EnumerableQueryable from "../Queryables/EnumerableQueryable";
import EnumerableBase from "./EnumerableBase";


export default class SkipEnumerable<T> extends EnumerableBase<T>
{
    private readonly _enumerable: IEnumerable<T>;
    private _itemsToSkip: number;

    constructor(enumerable: IEnumerable<T>, itemsToSkip: number)
    {
        super();
        this._enumerable = enumerable;
        this._itemsToSkip = itemsToSkip;
    }
    public asQueryable(): IQueryable<T>
    {
        return new EnumerableQueryable(this);
    }
    public getEnumerator(): IEnumerator<T>
    {
        return new SkipEnumerator<T>(this._enumerable.getEnumerator(), this._itemsToSkip);
    }
}
