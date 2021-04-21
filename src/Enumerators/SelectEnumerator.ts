import { IEnumerator } from "../Interfaces/IEnumerator";
import { Undefinable, Exception, Selector } from "@michaelcoxon/utilities";
import EnumeratorBase from "./EnumeratorBase";


export default class SelectEnumerator<T, TReturn> extends EnumeratorBase<TReturn> implements IEnumerator<TReturn>
{
    private readonly _enumerator: IEnumerator<T>;
    private readonly _selector: Selector<T, TReturn>;

    private _currentItem?: TReturn;

    constructor(enumerator: IEnumerator<T>, selector: Selector<T, TReturn>)
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

        return this._selector(item);
    }

    public reset(): void
    {
        this._enumerator.reset();
    }
}
