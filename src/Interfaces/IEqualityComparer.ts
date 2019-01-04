export interface IEqualityComparer<T>
{
    equals(x: T, y: T): boolean;
}
