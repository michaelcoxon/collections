import { IEnumerable } from "./IEnumerable";

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
     * @param array The one-dimensional Array that is the destination of the elements copied from ICollection<T>. The Array must have zero-based indexing.
     * @param arrayIndex The zero-based index in array at which copying begins.
     */
    copyTo(array: T[], arrayIndex: number): void;

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