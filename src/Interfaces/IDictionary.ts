import { ICollection } from "./ICollection";
import { KeyValuePair } from "../Types";

export interface IDictionary<TKey, TValue> extends ICollection<KeyValuePair<TKey, TValue>>
{
    readonly keys: TKey[];

    readonly values: TValue[];

    addKeyValue(key: TKey, value: TValue): void;

    containsKey(key: TKey): boolean;

    itemByKey(key: TKey): TValue;

    removeByKey(key: TKey): boolean;

    tryGetValue(key: TKey): { value?: TValue, success: boolean };
}
