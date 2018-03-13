import { ICollection } from "./ICollection";
import { IEnumerable } from "./IEnumerable";


export interface IKeyValuePair<TKey, TValue>
{
    readonly key: TKey;
    readonly value: TValue;
}

export interface IDictionary<TKey, TValue> extends ICollection<IKeyValuePair<TKey, TValue>>, IEnumerable<IKeyValuePair<TKey, TValue>>
{
    readonly count: number;

    readonly keys: TKey[];

    readonly values: TValue[];

    addKeyValue(key: TKey, value: TValue): void;

    containsKey(key: TKey): boolean;

    itemByKey(key: TKey): TValue;

    removeByKey(key: TKey): boolean;

    tryGetValue(key: TKey): { value: TValue | undefined, success: boolean };
}
