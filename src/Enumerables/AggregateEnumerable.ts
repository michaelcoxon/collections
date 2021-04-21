import AggregateEnumerator from "../Enumerators/AggregateEnumerator";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { IQueryable } from "../Interfaces/IQueryable";
import EnumerableQueryable from "../Queryables/EnumerableQueryable";
import EnumerableBase from "./EnumerableBase";


export default class AggregateEnumerable<T, TReturn> extends EnumerableBase<TReturn>
{
    private readonly _enumerable: IEnumerable<T>;
    private readonly _aggregateFunction: (acumulate: TReturn, current: T) => TReturn;

    constructor(enumerable: IEnumerable<T>, aggregateFunction: (acumulate: TReturn, current: T) => TReturn)
    {
        super();
        this._enumerable = enumerable;
        this._aggregateFunction = aggregateFunction;
    }

    public asQueryable(): IQueryable<TReturn>
    {
        return new EnumerableQueryable(this);
    }

    public getEnumerator(): IEnumerator<TReturn>
    {
        return new AggregateEnumerator(this._enumerable.getEnumerator(), this._aggregateFunction);
    }
}
