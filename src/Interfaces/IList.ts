import { ICollection } from "./ICollection";
import { IEnumerable } from "./IEnumerable";
import { IComparer } from "./IComparer";


export interface IList<T> extends ICollection<T>, IEnumerable<T>
{
    addRange(array: T[]): void;

    addRange(enumerable: IEnumerable<T>): void;

    indexOf(item: T): number | undefined

    insert(item: T, index: number): void

    prepend(item: T): void

    prepend(item: T): IEnumerable<T>

    prependRange(array: T[]): void;

    prependRange(enumerable: IEnumerable<T>): void;

    removeAt(index: number): void;

    sort(comparer: IComparer<T>): void
}
