import { IEnumerator } from "../Interfaces/IEnumerator";
import { isUndefinedOrNull } from "@michaelcoxon/utilities/lib/TypeHelpers";
import { Undefinable } from "@michaelcoxon/utilities/lib/Types";
import EnumeratorBase from "./EnumeratorBase";
import NullReferenceException from '@michaelcoxon/utilities/lib/Exceptions/NullReferenceException';


export default class AppendEnumerator<T> extends EnumeratorBase<T> implements IEnumerator<T>
{
    private readonly _enumerator: IEnumerator<T>;
    private readonly _appendedItemsEnumerator: IEnumerator<T>;

    private _current: Undefinable<T>;

    constructor(enumerator: IEnumerator<T>, appendedItemsEnumerator: IEnumerator<T>)
    {
        super();
        this._enumerator = enumerator;
        this._appendedItemsEnumerator = appendedItemsEnumerator;
    }

    public get current(): T
    {
        if (isUndefinedOrNull(this._current))
        {
            throw new NullReferenceException();
        }
        return this._current;
    }

    public moveNext(): boolean
    {
        if (this._enumerator.moveNext())
        {
            this._current = this._enumerator.current;
            return true;
        }
        else if (this._appendedItemsEnumerator.moveNext())
        {
            this._current = this._appendedItemsEnumerator.current;
            return true;
        }

        else
        {
            this._current = undefined;
            return false;
        }
    }

    public peek(): Undefinable<T>
    {
        let value: Undefinable<T> = undefined;

        if (!isUndefinedOrNull(value = this._enumerator.peek()))
        {
            return value;
        }
        else if (!isUndefinedOrNull(value = this._appendedItemsEnumerator.peek()))
        {
            return value;
        }

        else
        {
            return value;
        }
    }

    public reset(): void
    {
        this._enumerator.reset();
        this._appendedItemsEnumerator.reset();
    }
}
