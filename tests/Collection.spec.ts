import { Collection } from '../src/Collection';
import { expect } from 'chai';
import 'mocha';

describe("Create a collection", () =>
{
    it("should return a collection with the array items in the same order", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Collection(array);

        expect(array.length).eq(result.count);

        for (let i = 0; i < result.count; i++)
        {
            expect(array[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return a collection with the collection items in the same order", () =>
    {
        const collection = new Collection([1, 2, 3, 4]);
        const result = new Collection(collection);

        expect(collection.count).eq(result.count);

        for (let i = 0; i < result.count; i++)
        {
            expect(collection.item(i)).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});


describe("Copy a collection", () =>
{
    it("should return a collection the items appended to another collection", () =>
    {
        const coll1 = new Collection([1, 2, 3, 4]);
        const array = [-4, -3, -2, -1, 0];
        const expected = new Collection([-4, -3, -2, -1, 0, 1, 2, 3, 4]);

        coll1.copyTo(array, 0);

        for (let i = 0; i < array.length; i++)
        {
            expect(expected.item(i)).eq(array[i], `index ${i} is not the same. got ${expected.item(i)} != ${array[i]}`);
        }
    });
});


describe("Iterate over a collection", () =>
{
    it("should iterate over all items in a collection", () =>
    {
        const array = [1, 2, 3, 4];
        const coll1 = new Collection(array);

        let count = 0;

        coll1.forEach((value, index) =>
        {
            expect(array[index]).to.eq(value);
            expect(coll1.item(index)).to.eq(value);
            count++;
        });

        expect(array.length).to.eq(count);
    });

    it("should iterate over items in a collection and break on return false", () =>
    {
        const array = [1, 2, 3, 4];
        const coll1 = new Collection(array);

        let count = 0;

        coll1.forEach((value, index) =>
        {
            if (value === 3)
            {
                return false;
            }
            count++;
        });

        expect(2).to.eq(count);
    });
});



