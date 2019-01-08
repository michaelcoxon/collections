import { IEnumerable } from "./IEnumerable";
import { IQueryableGroup } from "./IQueryableGroup";
import { IComparer } from "./IComparer";
import { ConstructorFor, Predicate, Selector } from "@michaelcoxon/utilities";

export interface IQueryable<T> extends IEnumerable<T>
{
    /**
     * Returns true if all the items match the predicate, otherwise false
     * @param predicate
     */
    all(predicate: Predicate<T>): boolean;

    /**
     * Returns true if any of the items match the predicate, otherwise false
     * @param predicate
     */
    any(predicate?: Predicate<T>): boolean;

    /**
     * Returns the average of the numbers selected by the selector
     * @param selector
     */
    average(selector: Selector<T, number>): number;

    /** Returns the number of items in the queryable */
    count(): number;

    /**
     * Returns the unique items designated by the selector
     * @param selector
     */
    distinct<R>(selector: Selector<T, R>): IQueryable<T>;

    /** Returns the first item in the queryable */
    first(): T;

    /**
     * Returns the first item in the queryable that matches the predicate
     * @param predicate
     */
    first(predicate: Predicate<T>): T;

    /** Returns the first item in the queryable or null */
    firstOrDefault(): T | null;

    /**
     * Returns the first item in the queryable that matches the predicate or null
     * @param predicate
     */
    firstOrDefault(predicate: Predicate<T>): T | null;

    /**
     * Groups the items by the key selector using the default comparer
     * @param keySelector
     */
    groupBy<TKey>(keySelector: Selector<T, TKey>): IQueryable<IQueryableGroup<T, TKey>>;

    /**
     * Groups the items by the key selector using the specified comparer
     * @param keySelector
     * @param comparer
     */
    groupBy<TKey>(keySelector: Selector<T, TKey>, comparer: IComparer<TKey>): IQueryable<IQueryableGroup<T, TKey>>;

    /** Returns the last item in the queryable */
    last(): T;

    /**
     * Returns the last item in the queryable that matches the predicate
     * @param predicate
     */
    last(predicate: Predicate<T>): T;

    /** Returns the last item in the queryable or null */
    lastOrDefault(): T | null;

    /**
    * Returns the last item in the queryable that matches the predicate or null
    * @param predicate
    */
    lastOrDefault(predicate: Predicate<T>): T | null;

    /**
     * Returns the largest number designated by the selector
     * @param selector
     */
    max(selector: Selector<T, number>): number;

    /**
    * Returns the smallest number designated by the selector
    * @param selector
    */
    min(selector: Selector<T, number>): number;

    /**
     * Returns a queryable of items of the designated type
     * @param ctor the type
     */
    ofType<N extends T>(ctor: ConstructorFor<N>): IQueryable<N>;

    /**
     * Orders the queryable by the the selector and optional comparer ascending
     * @param selector
     * @param comparer
     */
    orderBy<R>(selector: Selector<T, R>, comparer?: IComparer<R>): IQueryable<T>;

    /**
     * Orders the queryable by the the selector and optional comparer descending
     * @param selector
     * @param comparer
     */
    orderByDescending<R>(selector: Selector<T, R>, comparer?: IComparer<R>): IQueryable<T>;

    /**
     * Selects the items by the selector
     * @param selector
     */
    select<TOut>(selector: Selector<T, TOut>): IQueryable<TOut>;

    //selectMany<TOut, TQ extends IQueryable<T>>(selector: Selector<TQ, TOut>): IQueryable<TOut>;

    single(): T;

    single(predicate: Predicate<T>): T;

    singleOrDefault(): T | null;

    singleOrDefault(predicate: Predicate<T>): T | null;

    skip(count: number): IQueryable<T>;

    /**
     * Splits a queryable into two queryables. One set is for true predicates, the other set is for false predicates.
     * @param predicate
     */
    split(predicate: Predicate<T>): { pTrue: IQueryable<T>, pFalse: IQueryable<T> };

    sum(selector: Selector<T, number>): number;

    take(count: number): IQueryable<T>;

    where(predicate: Predicate<T>): IQueryable<T>;
}