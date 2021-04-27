import { IEnumerator } from "../Interfaces/IEnumerator";
import { LinkedList } from "../Enumerables";
import EnumeratorBase from "./EnumeratorBase";
import Exception from '@michaelcoxon/utilities/lib/Exceptions/Exception';

export default class LinkedListEnumerator<T> extends EnumeratorBase<T> implements IEnumerator<T>
{
    private readonly _linkedList: LinkedList<T>;

    private _currentIndex: number;

    constructor(linkedList: LinkedList<T>)
    {
        super();
        this._linkedList = linkedList;
        this._currentIndex = -1;
    }

    public get current(): T
    {
        return this._linkedList.item(this._currentIndex)!;
    }

    public moveNext(): boolean
    {
        try
        {
            const item = this.peek();

            if (item === undefined)
            {
                return false;
            }

            this._currentIndex++;
            return true;
        }
        catch
        {
            return false;
        }
    }

    public peek(): T
    {
        const item = this._linkedList.item(this._currentIndex + 1);

        if (item === undefined)
        {
            throw new Exception("End of enumerator");
        }

        return item;
    }

    public reset(): void
    {
        this._currentIndex = -1;
    }
}