export interface IComparer<T>
{
    compare(x: T, y: T): number;

    equals(x: T, y: T): boolean;

    greaterThan(x: T, y: T): boolean;

    greaterThanOrEqual(x: T, y: T): boolean;

    lessThan(x: T, y: T): boolean;

    lessThanOrEqual(x: T, y: T): boolean;
}
