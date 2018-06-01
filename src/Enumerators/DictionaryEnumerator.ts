import { IEnumerator } from "../Interfaces/IEnumerator";
import { KeyValuePair } from "../Types";
import { IDictionary } from "../Interfaces/IDictionary";
import { ArrayEnumerator } from "./ArrayEnumerator";

export class DictionaryEnumerator<TKey, TValue> implements IEnumerator<KeyValuePair<TKey, TValue>>
{
    private readonly _dictionary: IDictionary<TKey, TValue>;
    private readonly _keyEnumerator: IEnumerator<TKey>;

    constructor(dictionary: IDictionary<TKey, TValue>)
    {
        this._dictionary = dictionary;
        this._keyEnumerator = new ArrayEnumerator(dictionary.keys);
    }

    public get current(): KeyValuePair<TKey, TValue>
    {
        const key = this._keyEnumerator.current;
        const value = this._dictionary.itemByKey(key);

        return { key, value };
    }

    public moveNext(): boolean
    {
        return this._keyEnumerator.moveNext();
    }

    public peek(): KeyValuePair<TKey, TValue>
    {
        const key = this._keyEnumerator.peek();
        const value = this._dictionary.itemByKey(key);

        return { key, value };
    }

    public reset(): void
    {
        this._keyEnumerator.reset();
    }
}