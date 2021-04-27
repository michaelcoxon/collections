import { IEnumerator } from "../Interfaces/IEnumerator";
import { Undefinable, Selector } from "@michaelcoxon/utilities/lib/Types";
import { IEnumerable } from "../Interfaces/IEnumerable";
import EnumeratorBase from "./EnumeratorBase";
import Exception from '@michaelcoxon/utilities/lib/Exceptions/Exception';


export default  class SelectManyEnumerator<T, TReturn> extends EnumeratorBase<TReturn> implements IEnumerator<TReturn>
{
    private _currentSetEnumerator?: IEnumerator<TReturn>;
    private readonly _enumerator: IEnumerator<T>;
    private readonly _selector: Selector<T, IEnumerable<TReturn>>;

    private _currentItem?: TReturn;

    constructor(enumerator: IEnumerator<T>, selector: Selector<T, IEnumerable<TReturn>>)
    {
        super();
        this._enumerator = enumerator;
        this._selector = selector;
    }

    public get current(): TReturn
    {
        if (this._currentItem === undefined)
        {
            throw new Exception("Current is undefined");
        }
        return this._currentItem;
    }

    public moveNext(): boolean
    {
        this._currentItem = this.peek();

        if (this._currentItem === undefined)
        {
            return false;
        }

        return this._enumerator.moveNext();
    }

    public peek(): Undefinable<TReturn>
    {
        let item = this._enumerator.peek();

        if (item === undefined)
        {
            return;
        }

        if (!this._currentSetEnumerator)
        {
            this._currentSetEnumerator = this._selector(item).getEnumerator();
        }

        if (this._currentSetEnumerator.moveNext())
        {
        }
    }

    public reset(): void
    {
        this._enumerator.reset();
    }
}
