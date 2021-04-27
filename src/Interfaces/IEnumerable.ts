import { IEnumerator } from "./IEnumerator";
import { IList } from "./IList";
import { IDictionary } from "./IDictionary";
import { ConstructorFor, Predicate, Selector, Undefinable } from "@michaelcoxon/utilities/lib/Types";
import { IComparer } from "./IComparer";
import { IEnumerableGroup } from "./IEnumerableGroup";


export interface IEnumerable<T> extends Iterable<T>
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
   distinct<R>(selector: Selector<T, R>): IEnumerable<T>;

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
   groupBy<TKey>(keySelector: Selector<T, TKey>): IEnumerable<IEnumerableGroup<T, TKey>>;

   /**
    * Groups the items by the key selector using the specified comparer
    * @param keySelector
    * @param comparer
    */
   groupBy<TKey>(keySelector: Selector<T, TKey>, comparer: IComparer<TKey>): IEnumerable<IEnumerableGroup<T, TKey>>;


   
   // /**
   //  * Returns a join aggregate of the inner to the current
   //  * @param inner
   //  * @param outerKeySelector
   //  * @param innerKeySelector
   //  * @param resultSelector
   //  */
   // join<TInner, TKey, TResult>(inner: IQueryable<TInner>, outerKeySelector: (o: T) => TKey, innerKeySelector: (i: TInner) => TKey, resultSelector: (o: T, i: TInner) => TResult): IQueryable<TResult>;

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
   ofType<N extends T>(ctor: ConstructorFor<N>): IEnumerable<N>;

   /**
    * Orders the queryable by the the selector and optional comparer ascending
    * @param selector
    * @param comparer
    */
   orderBy<R>(selector: Selector<T, R>, comparer?: IComparer<R>): IEnumerable<T>;

   /**
    * Orders the queryable by the the selector and optional comparer descending
    * @param selector
    * @param comparer
    */
   orderByDescending<R>(selector: Selector<T, R>, comparer?: IComparer<R>): IEnumerable<T>;

   /**
    * Selects the items by the selector
    * @param selector
    */
   select<TOut>(selector: Selector<T, TOut>): IEnumerable<TOut>;

   selectMany<TOut>(selector: Selector<T, IEnumerable<TOut>>): IEnumerable<TOut>;

   /**
    * Returns a single element only if there is one element in the queryable
    * @throws InvalidOperationException if there is not exactly one item in the queryable
    */
   single(): T;

   /**
    * Returns a single element only if there is one element in the queryable that matches the predicate
    * @param predicate
    * @throws InvalidOperationException if there is not exactly one item in the queryable that matches the predicate
    */
   single(predicate: Predicate<T>): T;

   /**
    * Returns a single element only if there is one element in the queryable. If there are no items in the
    * queryable, then null is returned
    * @throws InvalidOperationException if there is not exactly one or zero items in the queryable
    */
   singleOrDefault(): T | null;

   /**
    * Returns a single element only if there is one element in the queryable that matches the predicate. 
    * If there are no items in the queryable, then null is returned
    * @throws InvalidOperationException if there is not exactly one or zero item in the queryable that matches the predicate
    */
   singleOrDefault(predicate: Predicate<T>): T | null;

   /**
    * Skips the number of items specified. If the count is larger than the size
    * of the queryable, no items will be returned.
    * @param count the number of items to skip
    */
   skip(count: number): IEnumerable<T>;

   /**
    * Splits a queryable into two queryables. One set is for true predicates, the other set is for false predicates.
    * @param predicate
    */
   split(predicate: Predicate<T>): { pTrue: IEnumerable<T>, pFalse: IEnumerable<T> };

   /**
    * Sums the items in the queryable using the selector
    * @param selector selector to return the number to be summed
    */
   sum(selector: Selector<T, number>): number;

   /**
    * Takes the number of specified items from the queryable. If the count is
    * larger than the size of the queryable, all items will be returned
    * @param count the number of items to take.
    */
   take(count: number): IEnumerable<T>;

   /**
    * Filters the queryable by the predicate
    * @param predicate the filter for each item.
    */
   where(predicate: Predicate<T>): IEnumerable<T>;

    /**
     * Adds a value to the end of the sequence.
     * @param item
     */
    append(item: T): IEnumerable<T>;

    /**
     * Concatenates two sequences.
     * @param first The first sequence to concatenate.
     * @param second The sequence to concatenate to the first sequence.
     */
    concat(next: IEnumerable<T>): IEnumerable<T>;

    /**
     * Determines whether a sequence contains a specified element.
     * @param item The value to locate in the sequence.
     */
    contains(item: T): boolean;

    /**
     * Iterates over the enumerable and performs the callback on each item. Return false to break.
     * @param callback
     */
    forEach(callback: (value: T, index: number) => boolean | void): void;

    /** returns an Enumerator for the items */
    getEnumerator(): IEnumerator<T>;

    /**
     * Returns the item at the specified index
     * @param index The index of the item to return
     */
    item(index: number): Undefinable<T>;

    /**
     * Returns the item that match the type
     * @param ctor the constructor for the type to match
     */
    ofType<N extends T>(ctor: ConstructorFor<N>): IEnumerable<N>;

    /**
     * Adds a value to the beginning of the sequence.
     * @param item
     */
    prepend(item: T): IEnumerable<T>;

    /** Returns the items as an array */
    toArray(): T[];

    /** Returns a dictionary based on the key and value selctors */
    toDictionary<TKey, TValue>(keySelector: (a: T) => TKey, valueSelector: (a: T) => TValue): IDictionary<TKey, TValue>;

    /** Returns the items as a List */
    toList(): IList<T>;
}