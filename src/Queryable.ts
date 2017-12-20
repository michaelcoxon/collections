// private helper functions
import { Collection } from "./Collection";
import { Utilities } from "./Utilities";

export type Predicate<T> = (item: T) => boolean;

// public class jExt.Collections.Queryable
export class Queryable<T> extends Collection<T>
{
    public all(comparer: Predicate<T>): boolean
    {
        var output = true;

        output = this._baseArray.every((element) => comparer.call(element));

        return output;
    }

    public any(comparer: Predicate<T>): boolean
    {
        var output = false;

        if (!Array.prototype.some)
        {
            output = !this.all((element) => !comparer.call(element));

        }
        else
        {
            output = this._baseArray.some((element) => comparer.call(element));
        }

        return output;
    }

    // Clones the Queryable object
    public clone(): Queryable<T>
    {
        return new Queryable<T>(super.clone());
    }

    // USAGE: obj.Distinct(); or obj.Distinct(['key1'],['key2']);
    public distinct<K extends keyof T>(...keys: K[])
    {
        let hash: string;
        let temp: { [key: string]: boolean } = {};
        let hashIt = Utilities.getHash;

        if (keys.length > 0)
        {
            hashIt = (item) => Utilities.getHash(selectByArrayOfKeys(item, keys));
        }

        return this.where((item) =>
        {
            hash = hashIt(item);

            if (!temp[hash])
            {
                temp[hash] = true;
                return true;
            }

            return false;
        });
    }

    public first(): T
    {
        if (this._baseArray.length > 0)
        {
            return this._baseArray[0];
        }

        throw new Error("The collection is empty!");
    }

    public firstOrDefault(): T | null
    {
        if (this._baseArray.length > 0)
        {
            return this._baseArray[0];
        }

        return null;
    }

    public groupBy<K extends keyof T>(keys: K | K[]): Queryable<GroupedQueryable<T>>
    {
        if (!Array.isArray(keys))
        {
            return this.groupBy([keys]);
        }

        let pub = this;
        let uniqueSet = this
            .select((item) => new GroupedQueryable(pub, selectByArrayOfKeys(item, keys)))
            .distinct("key"); // distinct by the key

        uniqueSet = uniqueSet.orderBy(keys);

        return uniqueSet;
    }

    public ofType<N extends T>(type: { new(...args: any[]): N }): Queryable<N>
    {
        return this.asQueryable().where((item) => item instanceof type).select((item) => item as N);
    }

    // Orders the set by specified keys where the first orderby 
    // param is first preference. the key can be a method name 
    // without parenthesis.
    // USAGE: obj.OrderBy(['key1 DESC','key2','key3 ASC']);
    //        obj.OrderBy('key1 DESC');
    //        obj.OrderBy(function (a,b) {});
    public orderBy(args: string | string[] | ((a: T, b: T) => number)): Queryable<T>
    {
        if (this._baseArray.length > 0)
        {
            if (typeof args == 'string')
            {
                return this.orderBy([args]);
            }

            if (Array.isArray(args))
            {
                let o = args.length - 1;

                for (o; o != -1; o--)
                {
                    if (typeof args[o] != 'string')
                    {
                        throw new Error("Each key must be a string.");
                    }

                    let sortby = args[o].split(' ');
                    let key = sortby[0];
                    let direction = sortby[1] !== undefined ? sortby[1].toUpperCase() : 'ASC';
                    let directionModifier = 1;

                    if (direction == 'DESC')
                    {
                        directionModifier = -1;
                    }

                    return new Queryable<T>(this.toArray().sort((a: any, b: any) =>
                    {
                        if (typeof a[key] === 'function')
                        {
                            return compare(a[key](), b[key]()) * directionModifier;
                        }
                        else
                        {
                            return compare(a[key], b[key]) * directionModifier;
                        }
                    }));
                }
            }

            if (typeof args == 'function')
            {
                return new Queryable<T>(this.toArray().sort(args));
            }

            throw new Error("OrderBy type not supported.");
        }

        return new Queryable<T>(this.toArray());
    }

    public skip(count: number): Queryable<T>
    {
        var array = this.toArray();
        array.splice(0, count);
        return new Queryable<T>(array);
    }

    // USAGE: obj.Select(['key1','key2','key3']); USAGE: obj.Select('key1');
    public select<TOut>(args: string | string[] | ((value: T, index: number) => TOut)): Queryable<TOut>
    {
        if (typeof args == "string")
        {
            if (args == "*")
            {
                throw new Error("Select type not required.");
            }
            return this.select([args]);
        }

        if (Array.isArray(args))
        {
            return new Queryable<TOut>(this._baseArray.map((obj) => <TOut>selectByArrayOfKeys(obj, args)));
        }

        if (typeof args == 'function')
        {
            return new Queryable<TOut>(this._baseArray.map(args));
        }

        throw new Error("Select type not supported.");
    }

    public sum(key: string): number
    {
        return this.select<number>(key)
            .toArray()
            .reduce((a, c) => a + c, 0);
    }

    public take(count: number): Queryable<T>
    {
        return new Queryable<T>(this.toArray().splice(0, count));
    }

    // Returns the objects that evaluate true on the provided comparer function. 
    // USAGE: obj.Where(function() { return true; });
    public where(comparer: Predicate<T>): Queryable<T>
    {
        return new Queryable<T>(this._baseArray.filter(comparer));
    }
}

class GroupedQueryable<T>
{
    private readonly _parentQueryable: Queryable<T>;
    private readonly _key: Partial<T>;

    private _groupedRows: Queryable<T>;

    constructor(parentQueryable: Queryable<T>, key: Partial<T>)
    {
        this._parentQueryable = parentQueryable;
        this._key = key;
    }

    public get key(): Partial<T> 
    {
        return this._key;
    }

    public get groupedRows(): Queryable<T>
    {
        return this._groupedRows || (this._groupedRows = this._parentQueryable.where((groupItem) =>
        {
            for (let keyName in this._key)
            {
                if (this._key[keyName] != groupItem[keyName])
                {
                    return false;
                }
            }

            return true;
        }));
    }
}

function compare<T>(a: T, b: T): number
{
    if (typeof a == 'string' && typeof b == 'string')
    {
        if (a < b)
        {
            return -1;
        }

        if (a > b)
        {
            return 1;
        }

        return 0;
    }

    if (typeof a == 'number' && typeof b == 'number')
    {
        return a - b;
    }

    if (typeof a == 'object' && typeof b == 'object')
    {
        return compare(a.toString(), b.toString());
    }

    throw new TypeError("Cannot sort type of '" + Utilities.getType(a) + "'.");
}

// USAGE: SelectByArrayOfKeys(obj, ['key1','key2','key3']);
function selectByArrayOfKeys<T>(obj: T, keys: string[]): Partial<T>
{
    var output: Partial<T> = {};

    for (let item of keys)
    {
        let as = item.split(" as ");
        let key: keyof T;
        let newKey: string;

        if (as.length > 1)
        {
            key = <keyof T>as[0];
            newKey = as[1];
        }
        else
        {
            key = <keyof T>item;
            newKey = item;
        }

        if (obj[key] !== undefined)
        {
            output[newKey] = obj[key];
        }
        else
        {
            throw new Error("Key '" + key + "' does not exist.");
        }
    }

    return output;
}

declare module "./Collection" {
    interface Collection<T>
    {
        // returns the current Collection as a queryable object
        asQueryable(): Queryable<T>;
        ofType<N extends T>(type: { new(...args: any[]): N }): Collection<N>;
    }
}

Collection.prototype.asQueryable = function <T>(): Queryable<T>
{
    return new Queryable<T>(this);
}

Collection.prototype.ofType = function <T, N extends T>(type: { new(...args: any[]): N }): Collection<N>
{
    return this.asQueryable().where((item) => item instanceof type).select((item) => item as N);
}