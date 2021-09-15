import { IEnumerator } from "../Interfaces/IEnumerator";
import { Undefinable } from "@michaelcoxon/utilities/lib/Types";
import EnumeratorBase from "./EnumeratorBase";
import Exception from '@michaelcoxon/utilities/lib/Exceptions/Exception';


export default  class SkipEnumerator<T> extends EnumeratorBase<T> implements IEnumerator<T> {

    private readonly _enumerator: IEnumerator<T>;
    private readonly _itemsToSkip: number;

    private _currentItem?: T;
    private _count: number;

    constructor(enumerator: IEnumerator<T>, itemsToSkip: number)
    {
        super();
        this._enumerator = enumerator;
        this._itemsToSkip = itemsToSkip;
        this._count = 0;
    }

    public get current(): T
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

    public peek(): Undefinable<T>
    {
        while (this._count < this._itemsToSkip)
        {
            if (!this._enumerator.moveNext())
            {
                return undefined;
            }
            this._count++;
        }
        return this._enumerator.peek();

    }

    public reset(): void
    {
        this._count = 0;
        this._enumerator.reset();
    }
}
