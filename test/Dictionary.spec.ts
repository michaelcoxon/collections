import { Dictionary } from "../src/Enumerables";
import { expect, assert } from 'chai';
import 'mocha';

describe("Dictionary.constructor", () =>
{
    it("should return a Dictionary", () =>
    {
        const kvps = [
            { key: 'name', value: 'michael' },
            { key: 'age', value: 35 }
        ];
        const result = new Dictionary<string, any>(kvps);

        expect(kvps.length).eq(result.length);

        for (let key of result.keys)
        {
            expect(kvps.find(kvp => kvp.key == key)?.value).eq(result.itemByKey(key), `index ${key} is not the same`);
        }
    });

    it("should iterate a Dictionary with for(..of..)", () =>
    {
        const kvps = [
            { key: 'name', value: 'michael' },
            { key: 'age', value: 35 }
        ];
        const result = new Dictionary<string, any>(kvps);

        expect(kvps.length).eq(result.length);

        for (let kvp of result)
        {
            expect(kvps.find(i => i.key == kvp.key)?.value).eq(kvp.value, `index ${kvp.key} is not the same`);
        }
    });
});
