


export class KeyValuePair<TKey, TValue>
{
    private readonly _value: TValue;
    private readonly _key: TKey;

    constructor(key: TKey, value: TValue)
    {
        this._key = key;
        this._value = value;
    }

    public get key(): TKey
    {
        return this._key;
    }

    public get value(): TValue
    {
        return this._value;
    }
}