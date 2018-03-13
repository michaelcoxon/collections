import { IEnumerator } from "./IEnumerator";



export interface IEnumerable<T>
{    
    forEach(callback: (value: T, index: number) => boolean | void): void;
        
    // returns an Enumerator for the current Collection
    getEnumerator(): IEnumerator<T>;
    /** Returns the current IEnumerable as a queryable object */
    asQueryable(): Queryable<T>;

    /** Returns an enumerator that iterates through the collection. */
    getEnumerator(): IEnumerator<T>;

    ofType<N extends T>(type: { new(...args: any[]): N }): IEnumerable<N>;

    toArray(): T[];

    // returns the current Collection as a List
    toList(): List<T>;

}