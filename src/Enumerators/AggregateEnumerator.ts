import { IEnumerator } from "../Interfaces/IEnumerator";
import NullReferenceException from "@michaelcoxon/utilities/lib/Exceptions/NullReferenceException";
import { isUndefinedOrNull } from "@michaelcoxon/utilities/lib/TypeHelpers";
import { Undefinable } from "@michaelcoxon/utilities/lib/Types";
import EnumeratorBase from "./EnumeratorBase";


export default class AggregateEnumerator<T, TReturn> extends EnumeratorBase<TReturn> implements IEnumerator<TReturn>
{
    private readonly _enumerator: IEnumerator<T>;
    private readonly _aggregateFunction: (acumulate: TReturn, current: T) => TReturn;
    private readonly _initialValue?: TReturn;

    private _accumulate?: TReturn;

    constructor(enumerator: IEnumerator<T>, aggregateFunction: (acumulate: TReturn, current: T) => TReturn, initialValue?: TReturn)
    {
        super();
        this._enumerator = enumerator;
        this._aggregateFunction = aggregateFunction;
        this._accumulate = initialValue;
        this._initialValue = initialValue;
    }

    public get current(): TReturn
    {
        if (isUndefinedOrNull(this._accumulate))
        {
            throw new NullReferenceException();
        }
        return this._accumulate;
    }

    moveNext(): boolean
    {
        const currentValue = this._accumulate = this.peek();

        if (currentValue === undefined)
        {
            return false;
        }

        return this._enumerator.moveNext();
    }

    peek(): Undefinable<TReturn>
    {
        let item = this._enumerator.peek();

        if (item === undefined)
        {
            return;
        }

        return this._aggregateFunction(this._accumulate!, item);
    }

    reset(): void
    {
        this._enumerator.reset();
        this._accumulate = this._initialValue;
    }
}
