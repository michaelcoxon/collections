import { Collection } from "./Collection";
import { IDictionary, KeyValuePair } from "./IDictionary";
import { IEnumerableOrArray } from "./Types";
import { enumerableOrArrayToArray } from "./Utilities";
import { Utilities, KeyNotFoundException, KeyAlreadyDefinedException } from "@michaelcoxon/utilities";
import { IQueryable } from "./IQueryable";
import { IEnumerator } from "./IEnumerator";
import { IList } from "./IList";

export class Dictionary<TKey, TValue> extends Collection<KeyValuePair<TKey, TValue>> implements IDictionary<TKey, TValue>
{
    private _hashtable: { [hash: string]: KeyValuePair<TKey, TValue> };

    public readonly isReadOnly: boolean = false;

    // constructor
    constructor(enumerableOrArray?: IEnumerableOrArray<KeyValuePair<TKey, TValue>>)
    {
        super([]);
        this._hashtable = {};

        if (enumerableOrArray)
        {
            const items = enumerableOrArrayToArray(enumerableOrArray);
            for (let item of items)
            {
                this.add(item);
            }
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

    public add(keyValuePair: KeyValuePair<TKey, TValue>): void
    {
        let hash = Utilities.getHash(keyValuePair.key);

        if (this._hashtable[Utilities.getHash(keyValuePair.key)] !== undefined)
        {
            throw new KeyAlreadyDefinedException(keyValuePair.key);
        }

        this._baseArray.push(keyValuePair);
        this._hashtable[hash] = keyValuePair;
    }

    public addKeyValue(key: TKey, value: TValue): void
    {
        this.add({
            key: key,
            value: value
        });
    }

    public itemByKey(key: TKey): TValue
    {
        let hash = Utilities.getHash(key);
        if (this._hashtable[hash] === undefined)
        {
            throw new KeyNotFoundException(key);
        }
        return this._hashtable[hash].value;
    }

    containsKey(key: TKey): boolean
    {
        let hash = Utilities.getHash(key);
        return this._hashtable[hash] !== undefined;
    }

    removeByKey(key: TKey): boolean
    {
        let hash = Utilities.getHash(key);

        if (this._hashtable[hash] === undefined)
        {
            return false;
        }

        const kvp = this._hashtable[hash];
        this._baseArray.splice(this._baseArray.indexOf(kvp), 1);
        delete this._hashtable[hash];

        return true;
    }

    tryGetValue(key: TKey): { value?: TValue; success: boolean; }
    {
        try
        {
            return {
                value: this.itemByKey(key),
                success: true
            }
        }
        catch
        {
            return { success: false }
        }
    }

    clear(): void
    {
        super.clear();
        this._hashtable = {};
    }   

    remove(item: KeyValuePair<TKey, TValue>): boolean
    {
        if (super.remove(item))
        {
            let hash = Utilities.getHash(item.key);
            delete this._hashtable[hash];
            return true;
        }
        return false;
    }
}
