import { Predicate } from "@michaelcoxon/utilities";
import WhereEnumerator from "../Enumerators/WhereEnumerator";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { IQueryable } from "../Interfaces/IQueryable";
import EnumerableQueryable from "../Queryables/EnumerableQueryable";
import EnumerableBase from "./EnumerableBase";


export default class WhereEnumerable<T> extends EnumerableBase<T>
{
    private readonly _enumerable: IEnumerable<T>;
    private readonly _predicate: Predicate<T>;

    constructor(enumerable: IEnumerable<T>, predicate: Predicate<T>)
    {
        super();
        this._enumerable = enumerable;
        this._predicate = predicate;
    }

    public asQueryable(): IQueryable<T>
    {
        return new EnumerableQueryable(this);
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new WhereEnumerator<T>(this._enumerable.getEnumerator(), this._predicate);
    }
}
