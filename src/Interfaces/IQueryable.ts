﻿import { IEnumerable } from "./IEnumerable";
import { IQueryableGroup } from "./IQueryableGroup";
import { IComparer } from "./IComparer";
import { ConstructorFor, Predicate, Selector } from "@michaelcoxon/utilities";

export interface IQueryable<T> extends IEnumerable<T>
{
    all(predicate: Predicate<T>): boolean;

    any(predicate?: Predicate<T>): boolean;

    average(selector: Selector<T, number>): number;

    count(): number;

    distinct<R>(selector: Selector<T, R>): IQueryable<T>;

    first(): T;

    first(predicate: Predicate<T>): T;

    firstOrDefault(): T | null;

    firstOrDefault(predicate: Predicate<T>): T | null;

    groupBy<TKey>(keySelector: (a: T) => TKey): IQueryable<IQueryableGroup<T, TKey>>;

    last(): T;

    last(predicate: Predicate<T>): T;

    lastOrDefault(): T | null;

    lastOrDefault(predicate: Predicate<T>): T | null;

    max(selector: Selector<T, number>): number;

    min(selector: Selector<T, number>): number;

    ofType<N extends T>(ctor: ConstructorFor<N>): IQueryable<N>;

    orderBy<R>(selector: Selector<T, R>, comparer?: IComparer<R>): IQueryable<T>;

    orderByDescending<R>(selector: Selector<T, R>, comparer?: IComparer<R>): IQueryable<T>;

    select<TOut>(selector: Selector<T, TOut>): IQueryable<TOut>;

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