import { Predicate } from "./Types";
import { Utilities } from "@michaelcoxon/utilities";
import { IComparer } from "./Comparer";
import { IEnumerable } from "./IEnumerable";
import { IQueryableGroup } from "./IQueryableGroup";

export interface IQueryable<T> extends IEnumerable<T>
{
    all(predicate: Predicate<T>): boolean;
    any(predicate?: Predicate<T>): boolean;
    average<K extends keyof T>(propertyName: K): number;
    average(selector: (a: T) => number): number;
    average<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number;
    count(): number;
    distinct<K extends keyof T>(propertyName: K): IQueryable<T>;
    distinct<R>(selector: (a: T) => R): IQueryable<T>;
    distinct<K extends keyof T, R>(propertyNameOrSelector: K | ((a: T) => R)): IQueryable<T>;
    first(): T;
    first(predicate: Predicate<T>): T;
    first(predicate?: Predicate<T>): T;
    firstOrDefault(): T | null;
    firstOrDefault(predicate: Predicate<T>): T | null;
    firstOrDefault(predicate?: Predicate<T>): T | null;
    groupBy<K extends keyof T>(propertyName: K): IQueryable<IQueryableGroup<T, T[K]>>;
    groupBy<TKey>(keySelector: (a: T) => TKey): IQueryable<IQueryableGroup<T, TKey>>;
    groupBy<K extends keyof T, TKey>(propertyNameOrKeySelector: K | ((a: T) => TKey));
    last(): T;
    last(predicate: Predicate<T>): T;
    last(predicate?: Predicate<T>): T;
    lastOrDefault(): T | null;
    lastOrDefault(predicate: Predicate<T>): T | null;
    lastOrDefault(predicate?: Predicate<T>): T | null
    max<K extends keyof T>(propertyName: K): number;
    max(selector: (a: T) => number): number;
    max<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number;
    min<K extends keyof T>(propertyName: K): number;
    min(selector: (a: T) => number): number;
    min<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number;
    ofType<N extends T>(ctor: Utilities.ConstructorFor<N>): IQueryable<N>;
    orderBy<K extends keyof T>(propertyName: K, comparer?: IComparer<T[K]>): IQueryable<T>;
    orderBy<R>(selector: (a: T) => R, comparer?: IComparer<R>): IQueryable<T>;
    orderBy<K extends keyof T, R>(propertyNameOrSelector: K | ((a: T) => R), comparer?: IComparer<T[K] | R>): IQueryable<T>;
    orderByDescending<K extends keyof T>(propertyName: K, comparer?: IComparer<T[K]>): IQueryable<T>;
    orderByDescending<R>(selector: (a: T) => R, comparer?: IComparer<R>): IQueryable<T>;
    orderByDescending<K extends keyof T, R>(propertyNameOrSelector: K | ((a: T) => R), comparer?: IComparer<T[K] | R>): IQueryable<T>;
    skip(count: number): IQueryable<T>;
    select<K extends keyof T>(propertyName: K): IQueryable<T[K]>;
    select<TOut>(selector: (a: T) => TOut): IQueryable<TOut>;
    select<K extends keyof T, TOut>(propertyNameOrSelector: K | ((a: T) => TOut));
    sum<K extends keyof T>(propertyName: K): number;
    sum(selector: (a: T) => number): number;
    sum<K extends keyof T>(propertyNameOrSelector: K | ((a: T) => number)): number;
    take(count: number): IQueryable<T>;
    where(predicate: Predicate<T>): IQueryable<T>;
}