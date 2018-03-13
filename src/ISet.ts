import { ICollection } from "./ICollection";
import { IEnumerable } from "./IEnumerable";



export interface ISet<T> extends ICollection<T>, IEnumerable<T>
{
    /**
     * Removes all elements in the specified collection from the current set.
     * @param enumerable The collection of items to remove from the set.
     */
    exceptWith(enumerable: IEnumerable<T>): void;

    /**
     * Modifies the current set so that it contains only elements that are also in a specified collection.
     * @param enumerable The collection to compare to the current set.
     */
    intersectWith(enumerable: IEnumerable<T>): void;

    /**
     * Determines whether a set is a subset of a specified collection.
     * @param enumerable The collection to compare to the current set.
     * @returns true if the current set is a subset of other; otherwise, false.
     */
    isSubsetOf(enumerable: IEnumerable<T>): boolean;

    /**
     * Determines whether the current set is a superset of a specified collection.
     * @param enumerable The collection to compare to the current set.
     * @returns true if the current set is a superset of other; otherwise, false.
     */
    isSupersetOf(enumerable: IEnumerable<T>): boolean;

    /**
     * Determines whether the current set overlaps with the specified collection.
     * @param enumerable The collection to compare to the current set.
     * @returns true if the current set and other share at least one common element; otherwise, false.
     */
    overlaps(enumerable: IEnumerable<T>): boolean;

    /**
     * Determines whether the current set and the specified collection contain the same elements.
     * @param enumerable The collection to compare to the current set.
     * @returns true if the current set is equal to other; otherwise, false.
     */
    setEquals(enumerable: IEnumerable<T>): boolean;

    /**
     * Modifies the current set so that it contains only elements that are present either in the current set or in the specified collection, but not both.
     * @param enumerable The collection to compare to the current set.
     */
    symmetricExceptWith(enumerable: IEnumerable<T>): void;

    /**
     * Modifies the current set so that it contains all elements that are present in the current set, in the specified collection, or in both.
     * @param enumerable The collection to compare to the current set.
     */
    unionWith(enumerable: IEnumerable<T>): void;
}