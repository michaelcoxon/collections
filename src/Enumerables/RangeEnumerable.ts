import RangeEnumerator from "../Enumerators/RangeEnumerator";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { IQueryable } from "../Interfaces/IQueryable";
import EnumerableQueryable from "../Queryables/EnumerableQueryable";
import EnumerableBase from "./EnumerableBase";


export default  class RangeEnumerable extends EnumerableBase<number>
{
    private readonly _start: number;
    private readonly _count: number;

    constructor(start: number, count: number)
    {
        super();
        this._start = start;
        this._count = count;
    }

    public asQueryable(): IQueryable<number>
    {
        return new EnumerableQueryable(this);
    }

    public getEnumerator(): IEnumerator<number>
    {
        return new RangeEnumerator(this._start, this._count);
    }
}
