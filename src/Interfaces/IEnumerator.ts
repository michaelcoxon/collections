import { Undefinable } from "@michaelcoxon/utilities";


export interface IEnumerator<T>
{
    /** value of the current element */
    readonly current: T

    /** move to the next element. Returns false if there is no next element */
    moveNext(): boolean

    /** returns the next element without moving the pointer forwards */
    peek(): Undefinable<T>

    /** reset the pointer to the start */
    reset(): void
}

export interface IAsyncEnumerator<T>
{
    /** value of the current element */
    readonly current: T

    /** move to the next element. Returns false if there is no next element */
    moveNextAsync(): Promise<boolean>
}