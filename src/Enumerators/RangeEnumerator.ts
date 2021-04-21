import { IEnumerator } from "../Interfaces/IEnumerator";
import { Undefinable, ArgumentException, Exception } from "@michaelcoxon/utilities";
import EnumeratorBase from "./EnumeratorBase";


export default  class RangeEnumerator extends EnumeratorBase<number> implements IEnumerator<number>
{
    private readonly _start: number;
    private readonly _count: number;
    private readonly _increment: number;

    private _current?: number;
    private _iterations: number;


    constructor(start: number, count: number)
    {
        super();
        const integer = start > 0 ? Math.floor(start) : Math.ceil(start);
        if (start != integer)
        {
            throw new ArgumentException("Only integers are supported");
        }

        this._start = start;
        this._count = count;

        this._iterations = -1;
        this._increment = 1;
    }

    public get current(): number
    {
        if (this._iterations < 0)
        {
            throw new Exception("Call moveNext first");
        }
        if (this._current === undefined)
        {
            throw new Exception("Current is undefined");
        }
        return this._current;
    }

    public moveNext(): boolean
    {
        this._current = this.peek();

        if (this._current === undefined)
        {
            return false;
        }

        this._iterations++;
        return true;
    }

    public peek(): Undefinable<number>
    {
        let index = this._iterations + 1;
        let value = this._start + (index * this._increment);

        if (index < this._count)
        {
            return value;
        }
    }

    public reset(): void
    {
        this._iterations = -1;
    }
}
