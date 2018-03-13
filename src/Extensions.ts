import { Queryable } from "./Queryable";
import { List } from "./List";
import { Enumerator } from "./Enumerator";
import { Collection } from "./Collection";

declare module "./Collection" {
    interface Collection<T>
    {
        // returns the current Collection as a queryable object
        asQueryable(): Queryable<T>;

        ofType<N extends T>(type: { new(...args: any[]): N }): Collection<N>;

        // returns the current Collection as a List
        toList(): List<T>;

        // returns an Enumerator for the current Collection
        getEnumerator(): Enumerator<T>;
    }
}

Collection.prototype.asQueryable = function <T>(): Queryable<T>
{
    return new Queryable<T>(this);
}

Collection.prototype.ofType = function <T, N extends T>(type: { new(...args: any[]): N }): Collection<N>
{
    return this.asQueryable().where((item) => item instanceof type).select((item) => item as N);
}

Collection.prototype.toList = function <T>(): List<T>
{
    return new List<T>(this.toArray());
}

Collection.prototype.getEnumerator = function <T>(): Enumerator<T>
{
    return new Enumerator<T>(this);
}