import { IEnumerator } from "../../Interfaces/IEnumerator";
import { Undefinable, Exception, Predicate } from "@michaelcoxon/utilities";
import EnumeratorBase from "../EnumeratorBase";


export class WhereEnumerator<T> extends EnumeratorBase<T> implements IEnumerator<T> {

    private readonly _enumerator: IEnumerator<T>;
    private readonly _predicate: Predicate<T>;

    private _currentItem?: T;

    constructor(enumerator: IEnumerator<T>, predicate: Predicate<T>)
    {
        super();
        this._enumerator = enumerator;
        this._predicate = predicate;
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
        while (true)
        {
            let item = this._enumerator.peek();

            if (item === undefined)
            {
                return;
            }

            if (this._predicate(item))
            {
                return item;
            }

            if (!this._enumerator.moveNext())
            {
                break;
            }
        }
    }

    public reset(): void
    {
        this._enumerator.reset();
    }
}
