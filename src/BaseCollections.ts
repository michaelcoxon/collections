import { Undefinable, Utilities, ArgumentException } from "@michaelcoxon/utilities";
import { IEnumerable } from "./Interfaces/IEnumerable";
import { IQueryable } from "./Interfaces/IQueryable";
import { IEnumerator } from "./Interfaces/IEnumerator";
import { IList } from "./Interfaces/IList";
import { IDictionary } from "./Interfaces/IDictionary";
import { ICollection } from "./Interfaces/ICollection";
import { IEnumerableOrArray } from "./Types";
import { enumerableOrArrayToArray } from "./Utilities";
import { IComparer } from "./Interfaces/IComparer";
import { EnumerableQueryable } from "./Queryables/EnumerableQueryable";
import { Dictionary } from "./Dictionary";
import { DefaultComparer } from "./Comparers/DefaultComparer";
import { ArrayEnumerator } from "./Enumerators";

export class ArrayEnumerable<T> implements IEnumerable<T>
{
    protected _baseArray: T[];

    constructor(array: T[])
    {
        this._baseArray = array;
    }

    public append(item: T): IEnumerable<T>
    {
        return new ArrayEnumerable([...this._baseArray, item]);
    }

    public asQueryable(): IQueryable<T>
    {
        return new EnumerableQueryable<T>(this);
    }

    concat(next: IEnumerable<T>): IEnumerable<T>
    {
        return new ArrayEnumerable([...this._baseArray, ...next.toArray()]);
    }

    contains(item: T): boolean
    {
        return this._baseArray.indexOf(item) != -1;
    }

    // iterates over each item in the Collection. Return false to break.
    public forEach(callback: (value: T, index: number) => boolean | void): void
    {
        for (let i = 0; i < this._baseArray.length; i++)
        {
            if (false === callback(this._baseArray[i], i))
            {
                break;
            }
        }
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new ArrayEnumerator<T>(this._baseArray);
    }

    public item(index: number): Undefinable<T>
    {
        try
        {
            return this._baseArray[index];
        }
        catch
        {
            return undefined;
        }
    }

    public ofType<N extends T>(type: { new(...args: any[]): N }): IEnumerable<N>
    {
        return this
            .asQueryable()
            .where((item) => item instanceof type)
            .select((item) => item as N);
    }

    public prepend(item: T): IEnumerable<T>
    {
        return new ArrayEnumerable([item, ...this._baseArray]);
    }

    public toArray(): T[]
    {
        return [...this._baseArray];
    }

    public toDictionary<TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): IDictionary<TKey, TValue>
    {
        return new Dictionary(this.toArray().map(i => ({ key: keySelector(i), value: valueSelector(i) })));
    }

    public toList(): IList<T>
    {
        return new List<T>(this);
    }
}

export class Collection<T> extends ArrayEnumerable<T> implements ICollection<T>, IEnumerable<T>
{
    constructor(enumerableOrArray?: IEnumerableOrArray<T>)
    {
        if (enumerableOrArray === undefined)
        {
            super([]);
        }
        else
        {
            super(enumerableOrArrayToArray(enumerableOrArray));
        }
    }

    public get count(): number
    {
        return this._baseArray.length;
    }

    public get isReadOnly(): boolean
    {
        return false;
    }

    public add(obj: T): void
    {
        this._baseArray.push(obj);
    }

    public clear(): void
    {
        this._baseArray.length = 0;
    }

    public contains(obj: T): boolean
    {
        return this._baseArray.indexOf(obj) != -1;
    }

    public copyTo(array: T[], arrayIndex: number): void
    {
        if (this.count > (array.length - arrayIndex))
        {
            throw new ArgumentException("array", "Array is not big enough to store the collection");
        }
        array.splice(arrayIndex, this.count, ...this._baseArray);
    }

    public remove(item: T): boolean
    {
        let index = this._baseArray.indexOf(item);

        if (index != undefined)
        {
            this._baseArray.splice(index, 1);
            return true;
        }
        else
        {
            return false;
        }
    }
}

export class List<T> extends Collection<T> implements IList<T>, ICollection<T>, IEnumerable<T>
{
    public addRange(array: T[]): void;
    public addRange(enumerable: IEnumerable<T>): void;
    public addRange(enumerableOrArray: IEnumerableOrArray<T>): void
    {
        let array = enumerableOrArrayToArray(enumerableOrArray);
        this._baseArray = this._baseArray.concat(array);
    }

    public find(obj: T, isEquivilent: boolean = false): T | undefined
    {
        if (isEquivilent)
        {
            for (let item of this._baseArray)
            {
                var found = false;

                if (isEquivilent)
                {
                    found = Utilities.equals(item, obj);
                }
                if (found)
                {
                    return item;
                }
            }
        }
        else
        {
            let index = this.indexOf(obj);
            if (index !== undefined)
            {
                return this.item(index);
            }
            else
            {
                return undefined;
            }
        }
    }

    public indexOf(obj: T, isEquivilent: boolean = false): number | undefined
    {
        if (isEquivilent)
        {
            let index: number | undefined = undefined;

            this.forEach((item, i) =>
            {
                let found = false;

                if (isEquivilent)
                {
                    found = Utilities.equals(item, obj);
                }
                else
                {
                    found = item == obj;
                }
                if (found)
                {
                    index = i;
                    return false;
                }
            });

            return index;
        }
        else
        {
            let index = this._baseArray.indexOf(obj);
            if (index == -1)
            {
                return undefined;
            }
            return index;
        }
    }

    public insert(obj: T, index: number): void
    {
        this._baseArray.splice(index, 0, obj);
    }

    public prepend(obj: T): void
    public prepend(obj: T): IEnumerable<T>
    public prepend(obj: T): IEnumerable<T> | void
    {
        this.insert(obj, 0);
        return this;
    }

    public prependRange(array: T[]): void;
    public prependRange(enumerable: Collection<T>): void;
    public prependRange(enumerableOrArray: IEnumerableOrArray<T>): void
    {
        let array = enumerableOrArrayToArray(enumerableOrArray);
        this._baseArray.splice(0, 0, ...array);
    }

    public removeAt(index: number): void
    {
        this._baseArray.splice(index, 1);
    }

    public sort(comparer: IComparer<T> = new DefaultComparer<T>()): void
    {
        this._baseArray.sort((a, b) => comparer.compare(a, b));
    }
}
