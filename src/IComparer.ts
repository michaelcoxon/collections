export interface IComparer<T>
{
    compare(x: T, y: T): number;

    equals(x: T, y: T): boolean;
}
