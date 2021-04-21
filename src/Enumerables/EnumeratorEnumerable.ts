import { IEnumerator } from "../Interfaces/IEnumerator";
import { IQueryable } from "../Interfaces/IQueryable";
import EnumerableQueryable from "../Queryables/EnumerableQueryable";
import EnumerableBase from "./EnumerableBase";


export default  class EnumeratorEnumerable<T> extends EnumerableBase<T>
{
    private readonly _enumerator: IEnumerator<T>;

    constructor(enumerator: IEnumerator<T>)
    {
        super();
        this._enumerator = enumerator;
    }

    public asQueryable(): IQueryable<T>
    {
        return new EnumerableQueryable(this);
    }

    getEnumerator(): IEnumerator<T>
    {
        return this._enumerator;
    }
}
