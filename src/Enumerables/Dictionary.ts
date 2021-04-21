import { Utilities, KeyAlreadyDefinedException, KeyNotFoundException } from "@michaelcoxon/utilities";
import DictionaryEnumerator from "../Enumerators/DictionaryEnumerator";
import { IEnumerable } from "../Interfaces/IEnumerable";
import { IEnumerator } from "../Interfaces/IEnumerator";
import { IDictionary } from "../Interfaces/IDictionary";
import { ICollection } from '../Interfaces/ICollection';
import { IEnumerableOrArray, KeyValuePair } from '../Types';
import EnumerableBase from "./EnumerableBase";
import Enumerable from "./Enumerable";
import { IQueryable } from "../Interfaces/IQueryable";
import EnumerableQueryable from "../Queryables/EnumerableQueryable";


export default class Dictionary<TKey, TValue> extends EnumerableBase<KeyValuePair<TKey, TValue>> implements IDictionary<TKey, TValue>, ICollection<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>
{
    private _hashtable: { [hash: string]: KeyValuePair<TKey, TValue>; };

    public readonly isReadOnly: boolean = false;

    // constructor
    constructor(enumerableOrArray?: IEnumerableOrArray<KeyValuePair<TKey, TValue>>)
    {
        super();
        this._hashtable = {};

        if (enumerableOrArray)
        {
            const items = Enumerable.asArray(enumerableOrArray);
            for (let item of items)
            {
                this.add(item);
            }
        }
    }

    public get count(): number
    {
        return Object.keys(this._hashtable).length;
    }

    public get keys(): TKey[]
    {
        return Object.keys(this._hashtable).map(key => this._hashtable[key].key);
    }

    public get values(): TValue[]
    {
        return Object.keys(this._hashtable).map(key => this._hashtable[key].value);
    }

    public add(keyValuePair: KeyValuePair<TKey, TValue>): void
    {
        let hash = Utilities.getHash(keyValuePair.key);

        if (this._hashtable[Utilities.getHash(keyValuePair.key)] !== undefined)
        {
            throw new KeyAlreadyDefinedException(keyValuePair.key);
        }

        this._hashtable[hash] = keyValuePair;
    }

    public addKeyValue(key: TKey, value: TValue): void
    {
        this.add({ key: key, value: value });
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

    public containsKey(key: TKey): boolean
    {
        let hash = Utilities.getHash(key);
        return this._hashtable[hash] !== undefined;
    }

    public removeByKey(key: TKey): boolean
    {
        let hash = Utilities.getHash(key);

        if (this._hashtable[hash] === undefined)
        {
            return false;
        }

        delete this._hashtable[hash];

        return true;
    }

    public tryGetValue(key: TKey): { value?: TValue; success: boolean; }
    {
        try
        {
            return {
                value: this.itemByKey(key),
                success: true
            };
        }
        catch {
            return { success: false };
        }
    }

    public clear(): void
    {
        this._hashtable = {};
    }

    public remove(item: KeyValuePair<TKey, TValue>): boolean
    {
        let hash = Utilities.getHash(item.key);
        if (this._hashtable[hash] === undefined || this._hashtable[hash].value !== item.value)
        {
            return false;
        }

        delete this._hashtable[hash];

        return true;
    }

    public contains(item: KeyValuePair<TKey, TValue>): boolean
    {
        let hash = Utilities.getHash(item.key);
        if (this._hashtable[hash] === undefined || this._hashtable[hash].value !== item.value)
        {
            return false;
        }

        return true;
    }

    public copyTo(array: KeyValuePair<TKey, TValue>[], arrayIndex: number): void
    {
        array.splice(arrayIndex, this.count, ...this.toArray());
    }

    public asQueryable(): IQueryable<KeyValuePair<TKey, TValue>>
    {
        return new EnumerableQueryable(this);
    }

    public getEnumerator(): IEnumerator<KeyValuePair<TKey, TValue>>
    {
        return new DictionaryEnumerator(this);
    }
}
