import { ICollection } from "./ICollection";
import { IEnumerable } from "./IEnumerable";
import { IEnumerableOrArray } from "./Types";
import { IComparer } from "./Comparer";


export interface IList<T> extends ICollection<T>, IEnumerable<T>
{
    addRange(array: T[]): void;

    addRange(enumerable: IEnumerable<T>): void;

    indexOf(obj: T): number | undefined

    insert(obj: T, index: number): void

    prepend(obj: T): void

    prependRange(array: T[]): void;

    prependRange(enumerable: IEnumerable<T>): void;

    sort(comparer: IComparer<T>): void
}
