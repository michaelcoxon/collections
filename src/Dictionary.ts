import { Utilities, KeyAlreadyDefinedException, KeyNotFoundException } from "@michaelcoxon/utilities";
import { enumerableOrArrayToArray } from "./Utilities";
import { IDictionary } from "./Interfaces/IDictionary";
import { KeyValuePair, IEnumerableOrArray } from "./Types";
import { ICollection } from "./Interfaces/ICollection";
import { IEnumerable } from "./Interfaces/IEnumerable";
import { IQueryable } from "./Interfaces/IQueryable";
import { IEnumerator } from "./Interfaces/IEnumerator";
import { IList } from "./Interfaces/IList";
import { EnumerableQueryable } from "./Queryables/EnumerableQueryable";
import { List, ArrayEnumerable } from "./BaseCollections";
import { DictionaryEnumerator } from "./Enumerators";
import { randomBytes } from 'crypto';

export class Dictionary<TKey, TValue> implements IDictionary<TKey, TValue>, ICollection<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>
{
    private _hashtable: { [hash: string]: KeyValuePair<TKey, TValue> };

    public readonly isReadOnly: boolean = false;

    // constructor
    constructor(enumerableOrArray?: IEnumerableOrArray<KeyValuePair<TKey, TValue>>)
    {
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

    public append(item: KeyValuePair<TKey, TValue>): Dictionary<TKey, TValue>
    {
        const d = new Dictionary<TKey, TValue>();

        const en = this.getEnumerator();

        while (en.moveNext())
        {
            d.add(en.current);
        }
        d.add(item);

        return d;
    }

    public get count(): number
    {
        return Object.keys(this._hashtable).length;
    }

    public concat(next: IEnumerable<KeyValuePair<TKey, TValue>>): Dictionary<TKey, TValue>
    {
        const d = new Dictionary<TKey, TValue>();

        const en1 = this.getEnumerator();
        while (en1.moveNext())
        {
            d.add(en1.current);
        }

        const en2 = next.getEnumerator();
        while (en2.moveNext())
        {
            d.add(en2.current);
        }

        return d;
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
            }
        }
        catch
        {
            return { success: false }
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
        return new EnumerableQueryable<KeyValuePair<TKey, TValue>>(this);
    }

    public forEach(callback: (value: KeyValuePair<TKey, TValue>, index: number) => boolean | void): void
    {
        const en = this.getEnumerator();
        let index = 0;

        while (en.moveNext())
        {
            if (false === callback(en.current, index++))
            {
                break;
            }
        }
    }

    public getEnumerator(): IEnumerator<KeyValuePair<TKey, TValue>>
    {
        return new DictionaryEnumerator(this);
    }

    public item(index: number): KeyValuePair<TKey, TValue> | undefined
    {
        const en = this.getEnumerator();
        let i = 0;

        while (en.moveNext())
        {
            if (i == index)
            {
                return en.current;
            }
        }

        return undefined;
    }

    public ofType<N extends KeyValuePair<TKey, TValue>>(ctor: new (...args: any[]) => N): IEnumerable<N>
    {
        return this
            .asQueryable()
            .where((item) => item instanceof ctor).select((item) => item as N);
    }

    public toArray(): KeyValuePair<TKey, TValue>[]
    {
        const en = this.getEnumerator();
        const result: KeyValuePair<TKey, TValue>[] = [];

        while (en.moveNext())
        {
            result.push(en.current);
        }

        return result;
    }

    public toDictionary<TNewKey, TNewValue>(keySelector: (a: KeyValuePair<TKey, TValue>) => TNewKey, valueSelector: (a: KeyValuePair<TKey, TValue>) => TNewValue): IDictionary<TNewKey, TNewValue>
    {
        return new Dictionary(this.asQueryable().select(i => ({ key: keySelector(i), value: valueSelector(i) })));
    }

    public toList(): IList<KeyValuePair<TKey, TValue>>
    {
        return new List(this.toArray());
    }

    public prepend(item: KeyValuePair<TKey, TValue>): Dictionary<TKey, TValue>
    {
        const d = new Dictionary<TKey, TValue>();
        d.add(item);

        const en = this.getEnumerator();

        while (en.moveNext())
        {
            d.add(en.current);
        }

        return d;
    }
}
