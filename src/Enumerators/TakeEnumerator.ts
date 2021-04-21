import { IEnumerator } from "../Interfaces/IEnumerator";
import { Undefinable, Exception } from "@michaelcoxon/utilities";
import EnumeratorBase from "./EnumeratorBase";


export default  class TakeEnumerator<T> extends EnumeratorBase<T> implements IEnumerator<T> {

    private readonly _enumerator: IEnumerator<T>;
    private readonly _itemsToTake: number;

    private _currentItem?: T;
    private _itemsTaken: number;

    constructor(enumerator: IEnumerator<T>, itemsToTake: number)
    {
        super();
        this._enumerator = enumerator;
        this._itemsToTake = itemsToTake;
        this._itemsTaken = 0;
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

        this._itemsTaken++;
        return this._enumerator.moveNext();
    }

    public peek(): Undefinable<T>
    {
        if (this._itemsTaken == this._itemsToTake)
        {
            return;
        }
        return this._enumerator.peek();
    }

    public reset(): void
    {
        this._enumerator.reset();
    }
}
