import { List } from '../src/List';
import { expect } from 'chai';
import 'mocha';

describe("Create a List", () =>
{
    it("should return a List with the array items in the same order", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new List(array);

        expect(array.length).eq(result.count);

        for (let i = 0; i < result.count; i++)
        {
            expect(array[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return a List with the List items in the same order", () =>
    {
        const collection = new List([1, 2, 3, 4]);
        const result = new List(collection);

        expect(collection.count).eq(result.count);

        for (let i = 0; i < result.count; i++)
        {
            expect(collection.item(i)).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});