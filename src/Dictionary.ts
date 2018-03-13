import { Collection, ICollection, EnumerableOrArray } from "./Collection";
import { KeyValuePair } from "./KeyValuePair";
import { KeyAlreadyDefinedException, KeyNotFoundException } from "./Exceptions";
import { Utilities } from "./Utilities";

export class Dictionary<TKey, TValue>
{
    private readonly _hashtable: { [hash: string]: KeyValuePair<TKey, TValue> };
    private readonly _baseArray: KeyValuePair<TKey, TValue>[];

    // constructor
    constructor(collectionOrArray?: EnumerableOrArray<KeyValuePair<TKey, TValue>>)
    {
        this._hashtable = {};
        this._baseArray = [];

        if (collectionOrArray !== undefined)
        {
            let array = Collection.collectionOrArrayToArray(collectionOrArray);
        }
    }

    public get count(): number
    {
        return this._baseArray.length;
    }

    public get keys(): TKey[]
    {
        return this._baseArray.map(kvp => kvp.key);
    }

    public get values(): TValue[]
    {
        return this._baseArray.map(kvp => kvp.value);
    }

    public add(key: TKey, value: TValue): void
    {
        this.addKeyValuePair(new KeyValuePair(key, value));
    }

    public addKeyValuePair(keyValuePair: KeyValuePair<TKey, TValue>): void
    {
        this.ensureKeysAvailable(keyValuePair.key);
        this._baseArray.push(keyValuePair);
        this._hashtable[Utilities.getHash(keyValuePair.key)] = keyValuePair;
    }

    public addRange(keyValuePairs: KeyValuePair<TKey, TValue>[]): void
    {
        this.ensureKeysAvailable(...keyValuePairs.map(kvp => kvp.key));
        for (let kvp of keyValuePairs)
        {
            this.addKeyValuePair(kvp);
        }
    }

    public item(key:TKey): TValue
    {
        let hash = Utilities.getHash(key);
        if (this._hashtable[hash] === undefined)
        {
            throw new KeyNotFoundException(key);
        }
        return this._hashtable[hash].value;
    }

    public toArray(): KeyValuePair<TKey, TValue>[]
    {
        return [...this._baseArray];
    }

    private ensureKeysAvailable(...keys: TKey[])
    {
        for (let key of keys)
        {
            if (this.keys.indexOf(key) != -1)
            {
                throw new KeyAlreadyDefinedException(key);
            }
        }
    }

    private ensureKey(key: TKey)
    {
        if (this.keys.indexOf(key) == -1)
        {
            throw new KeyNotFoundException(key);
        }
    }
}

declare module "./Collection" {
    interface Collection<T>
    {
        toDictionary<TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): Dictionary<TKey, TValue>
    }
}

Collection.prototype.toDictionary = function <T, TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): Dictionary<TKey, TValue>
{
    return new Dictionary(this.toArray().map(i => new KeyValuePair(keySelector(i), valueSelector(i))));
}
