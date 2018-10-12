import { ICollection } from "./ICollection";
import { IEnumerable } from "./IEnumerable";
import { IComparer } from "./IComparer";


export interface IList<T> extends ICollection<T>, IEnumerable<T>
{
    addRange(array: T[]): void;

    addRange(enumerable: IEnumerable<T>): void;

    findItem(obj: T, isEquivilent?: boolean): T | undefined;

    indexOf(obj: T): number | undefined

    insert(obj: T, index: number): void

    prepend(obj: T): void

    prependRange(array: T[]): void;

    prependRange(enumerable: IEnumerable<T>): void;

    removeAt(index: number): void;

    sortBy(comparer: IComparer<T>): void
}
