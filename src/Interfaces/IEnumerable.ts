import { IEnumerator } from "./IEnumerator";
import { IList } from "./IList";
import { IQueryable } from "./IQueryable";
import { IDictionary } from "./IDictionary";
import { ConstructorFor, Undefinable } from "@michaelcoxon/utilities";


export interface IEnumerable<T>
{
    /**
     * Adds a value to the end of the sequence.
     * @param item
     */
    append(item: T): IEnumerable<T>;

    /** Returns the current IEnumerable as a queryable object */
    asQueryable(): IQueryable<T>;

    /**
     * Concatenates two sequences.
     * @param first The first sequence to concatenate.
     * @param second The sequence to concatenate to the first sequence.
     */
    concat(next: IEnumerable<T>): IEnumerable<T>;

    /**
     * Determines whether a sequence contains a specified element.
     * @param item The value to locate in the sequence.
     */
    contains(item: T): boolean;

    /**
     * Iterates over the enumerable and performs the callback on each item. Return false to break.
     * @param callback
     */
    forEach(callback: (value: T, index: number) => boolean | void): void;

    /** returns an Enumerator for the items */
    getEnumerator(): IEnumerator<T>;

    /**
     * Returns the item at the specified index
     * @param index The index of the item to return
     */
    item(index: number): Undefinable<T>;

    /**
     * Returns the item that match the type
     * @param ctor the constructor for the type to match
     */
    ofType<N extends T>(ctor: ConstructorFor<N>): IEnumerable<N>;

    /**
     * Adds a value to the beginning of the sequence.
     * @param item
     */
    prepend(item: T): IEnumerable<T>;

    /** Returns the items as an array */
    toArray(): T[];

    toDictionary<TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): IDictionary<TKey, TValue>;

    /** Returns the items as a List */
    toList(): IList<T>;
}