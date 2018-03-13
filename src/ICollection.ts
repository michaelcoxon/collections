import { IEnumerable } from "./IEnumerable";

export type IEnumerableOrArray<T> = T[] | IEnumerable<T>;


export interface ICollection<T> extends IEnumerable<T>
{
    /** Gets the number of elements contained in the ICollection<T>. */
    readonly count: number;

    /** Gets a value indicating whether the ICollection<T> is read-only. */
    readonly isReadOnly: boolean;

    /**
     * Adds an item to the ICollection<T>.
     * @param item The object to add to the ICollection<T>.
     */
    add(item: T): void;

    /** Removes all items from the ICollection<T>. */
    clear(): void;

    /**
     * Determines whether the ICollection<T> contains a specific value.
     * @param item The object to locate in the ICollection<T>.
     */
    contains(item: T): boolean;

    /**
     * Copies the elements of the ICollection<T> to an Array, starting at a particular Array index.
     * @param enumerableOrArray The one-dimensional Array that is the destination of the elements copied from ICollection<T>. The Array must have zero-based indexing.
     * @param enumerableOrArrayIndex The zero-based index in array at which copying begins.
     */
    copyTo(enumerableOrArray: IEnumerableOrArray<T>, enumerableOrArrayIndex: number): void;

    /**
     * Returns the item at the specified index
     * @param index The index of the item to return
     */
    item(index: number): T;

    /**
     * Removes the first occurrence of a specific object from the ICollection<T>.
     * @param item
     */
    remove(item: T): boolean;

    /**
     * Removes the object at the index from the ICollection<T>.
     * @param index
     */
    removeAt(index: number): void;
}