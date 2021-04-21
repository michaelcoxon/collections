import { Selector } from "@michaelcoxon/utilities";
import SelectManyEnumerator from "../Enumerators/SelectManyEnumerator";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { IQueryable } from "../Interfaces/IQueryable";
import EnumerableQueryable from "../Queryables/EnumerableQueryable";
import EnumerableBase from "./EnumerableBase";


export default  class SelectManyEnumerable<T, TReturn> extends EnumerableBase<TReturn>
{
    private readonly _enumerable: IEnumerable<T>;
    private readonly _selector: Selector<T, IEnumerable<TReturn>>;

    constructor(enumerable: IEnumerable<T>, selector: Selector<T, IEnumerable<TReturn>>)
    {
        super();
        this._enumerable = enumerable;
        this._selector = selector;
    }

    public asQueryable(): IQueryable<TReturn>
    {
        return new EnumerableQueryable(this);
    }

    public getEnumerator(): IEnumerator<TReturn>
    {
        return new SelectManyEnumerator<T, TReturn>(this._enumerable.getEnumerator(), this._selector);
    }
}
