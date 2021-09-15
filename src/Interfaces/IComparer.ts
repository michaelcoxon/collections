export interface IComparer<T>
{
    /**
     * Compares 'x' to 'y' where the following rules apply;
     *  - x < y : return <0
     *  - x == y : return 0
     *  - x > y : return >0
     */
    compare(x: T, y: T): number;

    /**
     * Returns true if 'x' is equal to 'y'.
     */
    equals(x: T, y: T): boolean;

    /**
     * Returns true if 'x' is greater than 'y'.
     */
    greaterThan(x: T, y: T): boolean;

    /**
     * Returns true if 'x' is greater than or equal to 'y'.
     */
    greaterThanOrEqual(x: T, y: T): boolean;

    /**
     * Returns true if 'x' is les than 'y'.
     */
    lessThan(x: T, y: T): boolean;

    /**
     * Returns true if 'x' is less than or equal to 'y'.
     */
    lessThanOrEqual(x: T, y: T): boolean;
}
