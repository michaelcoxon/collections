import { Undefinable } from "@michaelcoxon/utilities/lib/Types";
import { IEnumerator } from "../Interfaces/IEnumerator";


export default abstract class EnumeratorBase<T> implements IEnumerator<T>
{
    abstract readonly current: T;
    abstract moveNext(): boolean;
    abstract peek(): Undefinable<T>;
    abstract reset(): void;
    public readonly return?: (value?: any) => IteratorResult<T, any>;
    public readonly throw?: (e?: any) => IteratorResult<T, any>;
    public next(...args: []): IteratorResult<T, T>
    {
        const done = !this.moveNext();
        const value = done ? undefined : this.current;
        return { done, value: value! };
    }
}
