import { ISet } from "./Interfaces/ISet";
import { IEnumerable } from "./Interfaces/IEnumerable";
import { ICollection } from "./Interfaces/ICollection";
import { IList } from "./Interfaces/IList";
import { IDictionary } from "./Interfaces/IDictionary";
import { IEnumerator } from "./Interfaces/IEnumerator";
import { IQueryable } from "./Interfaces/IQueryable";
import { ArgumentException, Undefinable } from "@michaelcoxon/utilities";
import { EnumeratorEnumerable , Collection, ArrayEnumerable} from './Enumerables';
import { AppendEnumerator } from './Enumerators';


// all of this needs to be optimised

export class Set<T> implements ISet<T>, ICollection<T>, IEnumerable<T>
{
    private readonly _collection: ICollection<T>

    constructor(enumerable?: IEnumerable<T>)
    {
        this._collection = new Collection<T>(enumerable);
    }

    public get count(): number
    {
        return this._collection.count;
    }

    public get isReadOnly(): boolean
    {
        return this._collection.isReadOnly;
    }

    append(item: T): IEnumerable<T>
    {
        return this.concat(new ArrayEnumerable([item]));
    }

    concat(next: IEnumerable<T>): IEnumerable<T>
    {
        return new EnumeratorEnumerable(new AppendEnumerator(this.getEnumerator(), next.getEnumerator()));
    }

    prepend(item: T): IEnumerable<T>
    {
        return new ArrayEnumerable([item]).concat(this);
    }

    exceptWith(enumerable: IEnumerable<T>): void
    {
        const en = enumerable.getEnumerator();
        while (en.moveNext())
        {
            const item = en.current;
            if (this.contains(item))
            {
                this.remove(item);
            }
        }
    }

    intersectWith(enumerable: IEnumerable<T>): void
    {
        var array = enumerable.toArray();
        this.forEach((value, index) =>
        {
            if (array.indexOf(value) == -1)
            {
                this.remove(value);
            }
        });
    }

    isSubsetOf(enumerable: IEnumerable<T>): boolean
    {
        var array = enumerable.toArray();
        return this.toArray().every((value) => array.indexOf(value) > -1);
    }

    isSupersetOf(enumerable: IEnumerable<T>): boolean
    {
        var array = enumerable.toArray();
        return array.every((value) => this.contains(value));
    }

    overlaps(enumerable: IEnumerable<T>): boolean
    {
        var array = enumerable.toArray();
        return array.some((value) => this.contains(value));
    }

    setEquals(enumerable: IEnumerable<T>): boolean
    {
        return this.isSubsetOf(enumerable) && this.isSupersetOf(enumerable);
    }

    symmetricExceptWith(enumerable: IEnumerable<T>): void
    {
        // get the items that are only in both
        const intersect = new Set<T>(new Collection<T>(this.toArray()));
        intersect.intersectWith(enumerable);

        // union this with enumerable
        this.unionWith(enumerable);

        // remove the intersect from this
        this.exceptWith(intersect);
    }

    unionWith(enumerable: IEnumerable<T>): void
    {
        const en = enumerable.getEnumerator();

        while (en.moveNext())
        {
            const item = en.current;
            if (!this.contains(item))
            {
                this._collection.add(item);
            }
        }
    }

    /**
     * Adds an item to the ICollection<T>.
     * @param item The object to add to the ICollection<T>.
     * @throws {ArgumentException} When the item is already in the collection.
     */
    add(item: T): void
    {
        if (!this.contains(item))
        {
            this._collection.add(item);
        }
        else
        {
            throw new ArgumentException('item', 'item already in set');
        }
    }

    clear(): void
    {
        this._collection.clear();
    }

    contains(item: T): boolean
    {
        return this._collection.contains(item);
    }

    copyTo(array: T[], arrayIndex: number): void
    {
        this._collection.copyTo(array, arrayIndex);
    }

    remove(item: T): boolean
    {
        return this._collection.remove(item);
    }

    asQueryable(): IQueryable<T>
    {
        return this._collection.asQueryable();
    }

    forEach(callback: (value: T, index: number) => boolean | void): void
    {
        this._collection.forEach(callback);
    }

    getEnumerator(): IEnumerator<T>
    {
        return this._collection.getEnumerator();
    }

    item(index: number): Undefinable<T>
    {
        return this._collection.item(index);
    }

    ofType<N extends T>(ctor: new (...args: any[]) => N): IEnumerable<N>
    {
        return this._collection.ofType(ctor);
    }

    toArray(): T[]
    {
        return this._collection.toArray();
    }

    toDictionary<TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): IDictionary<TKey, TValue>
    {
        return this._collection.toDictionary(keySelector, valueSelector);
    }

    toList(): IList<T>
    {
        return this._collection.toList();
    }
}