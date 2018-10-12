import { ArgumentException, ConstructorFor, Undefinable, Utilities } from "@michaelcoxon/utilities";
import { DefaultComparer } from "./Comparers/DefaultComparer";
import { Dictionary } from "./Dictionary";
import { ArrayEnumerator } from "./Enumerators";
import { ICollection } from "./Interfaces/ICollection";
import { IComparer } from "./Interfaces/IComparer";
import { IDictionary } from "./Interfaces/IDictionary";
import { IEnumerable } from "./Interfaces/IEnumerable";
import { IEnumerator } from "./Interfaces/IEnumerator";
import { IList } from "./Interfaces/IList";
import { IQueryable } from "./Interfaces/IQueryable";
import { EnumerableQueryable } from "./Queryables/EnumerableQueryable";
import { IEnumerableOrArray } from "./Types";
import { enumerableOrArrayToArray } from "./Utilities";

export class ArrayEnumerable<T> extends Array<T> implements IEnumerable<T>
{
    constructor(array: T[] = [])
    {
        super(...array);
    }

    public asQueryable(): IQueryable<T>
    {
        return new EnumerableQueryable<T>(this);
    }

    public getEnumerator(): IEnumerator<T>
    {
        return new ArrayEnumerator<T>(this);
    }

    public item(index: number): Undefinable<T>
    {
        try
        {
            return this[index];
        }
        catch
        {
            return undefined;
        }
    }

    /**
     * Returns an IEnumerable of the elements in this array that are of the specified type
     * @param type the type to filter by
     */
    public ofType<N extends T>(type: ConstructorFor<N>): IQueryable<N>
    {
        return this
            .asQueryable()
            .where((item) => item instanceof type).select((item) => item as N);
    }
    /** Makes a copy of this and returns an array. Items are still reference. */
    public toArray(): T[]
    {
        return [...this];
    }

    public toDictionary<TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): IDictionary<TKey, TValue>
    {
        return new Dictionary(this.map(i => ({ key: keySelector(i), value: valueSelector(i) })));
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
        return this.length;
    }

    public get isReadOnly(): boolean
    {
        return false;
    }

    public add(obj: T): void
    {
        this.push(obj);
    }

    public clear(): void
    {
        this.length = 0;
    }

    public contains(obj: T): boolean
    {
        return this.indexOf(obj) != -1;
    }

    public copyTo(array: T[], arrayIndex: number): void
    {
        if (this.count > (array.length - arrayIndex))
        {
            throw new ArgumentException("array", "Array is not big enough to store the collection");
        }
        array.splice(arrayIndex, this.count, ...this);
    }

    public remove(item: T): boolean
    {
        let index = this.indexOf(item);

        if (index != undefined)
        {
            this.splice(index, 1);
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
        this.push(...array);
    }

    public findItem(obj: T, isEquivilent: boolean = false): T | undefined
    {
        if (isEquivilent)
        {
            for (let item of this)
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

    public insert(obj: T, index: number): void
    {
        this.splice(index, 0, obj);
    }

    public prepend(obj: T): void
    {
        this.insert(obj, 0);
    }

    public prependRange(array: T[]): void;
    public prependRange(enumerable: Collection<T>): void;
    public prependRange(enumerableOrArray: IEnumerableOrArray<T>): void
    {
        let array = enumerableOrArrayToArray(enumerableOrArray);
        this.splice(0, 0, ...array);
    }

    public removeAt(index: number): void
    {
        this.splice(index, 1);
    }

    public sortBy(comparer: IComparer<T> = new DefaultComparer<T>()): void
    {
        this.sort((a, b) => comparer.compare(a, b));
    }
}
