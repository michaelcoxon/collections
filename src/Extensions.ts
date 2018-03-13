import { Queryable } from "./Queryable";
import { List } from "./List";
import { Enumerator } from "./Enumerator";
import { Collection } from "./Collection";

declare module "./Collection" {
    interface Collection<T>
    {
        // returns the current Collection as a queryable object
        asQueryable(): Queryable<T>;

        forEach(callback: (value: T, index: number) => boolean | void): void;

        ofType<N extends T>(type: { new(...args: any[]): N }): Collection<N>;

        toArray(): T[];

        // returns the current Collection as a List
        toList(): List<T>;

        // returns an Enumerator for the current Collection
        getEnumerator(): Enumerator<T>;
    }
}




