import { Collection } from '../lib/Collection';
import { Queryable } from '../lib/Queryable';
import { ArgumentException } from "@michaelcoxon/utilities/lib/Exceptions";
import { expect, assert } from 'chai';
import 'mocha';



describe("Create a Queryable", () =>
{
    it("should return a Queryable with the array items in the same order", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(array.length).eq(result.count);

        for (let i = 0; i < result.count; i++)
        {
            expect(array[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return a Queryable with the List items in the same order", () =>
    {
        const collection = new Queryable([1, 2, 3, 4]);
        const result = new Queryable(collection);

        expect(collection.count).eq(result.count);

        for (let i = 0; i < result.count; i++)
        {
            expect(collection.item(i)).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});

describe("All", () =>
{
    it("should return true if all items match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(true).to.eq(result.all((i) => i > 0));
    });

    it("should return false if one item doesnt match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(false).to.eq(result.all((i) => i > 1));
    });
});

describe("Any", () =>
{
    it("should return true if the queryable has items", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(true).to.eq(result.any());
    });

    it("should return false if the queryable is empty", () =>
    {
        const array = [];
        const result = new Queryable(array);

        expect(false).to.eq(result.any());
    });

    it("should return true if any of the items match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(true).to.eq(result.any((i) => i == 2));
    });

    it("should return false if none of the items match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(false).to.eq(result.any((i) => i == -1));
    });
});

describe("Average", () =>
{
    it("should return the average of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new Queryable(array);

        const result = query.average((i) => i);

        expect(2.5).to.eq(result);
    });
});

describe("Distinct", () =>
{
    it("should return only unique items in the collection", () =>
    {
        const array = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4];
        const query = new Queryable(array);
        const expected = [1, 2, 3, 4];

        expect(array.length).eq(query.count);

        const result = query.distinct((n) => n);

        expect(expected.length).eq(result.count);

        for (let i = 0; i < result.count; i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});

describe("First", () =>
{
    it("should return the first item in the Queryable", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(1).to.eq(result.first());
    });

    it("should return the first item in the Queryable after applying the filter", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(2).to.eq(result.first(i => i % 2 == 0));
    });

    it("should throw an exception if the Queryable is empty", () =>
    {
        const array = [];
        const result = new Queryable(array);

        try
        {
            result.first();
            assert.fail(undefined, undefined, "For some reason the Queryable is not empty");
        }
        catch (ex) { }
    });
});

describe("FirstOrDefault", () =>
{
    it("should return the first item in the Queryable", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(1).to.eq(result.firstOrDefault());
    });

    it("should return the first item in the Queryable after applying the filter", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(2).to.eq(result.firstOrDefault(i => i % 2 == 0));
    });

    it("should return null if the Queryable is empty", () =>
    {
        const array = [];
        const result = new Queryable(array);

        expect(null).to.eq(result.firstOrDefault());
    });
});

describe("Last", () =>
{
    it("should return the last item in the Queryable", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(4).to.eq(result.last());
    });

    it("should return the last item in the Queryable after applying the filter", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(3).to.eq(result.last(i => i % 2 != 0));
    });

    it("should throw an exception if the Queryable is empty", () =>
    {
        const array = [];
        const result = new Queryable(array);

        try
        {
            result.last();
            assert.fail(undefined, undefined, "For some reason the Queryable is not empty");
        }
        catch (ex) { }
    });
});

describe("LastOrDefault", () =>
{
    it("should return the last item in the Queryable", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(4).to.eq(result.lastOrDefault());
    });

    it("should return the last item in the Queryable after applying the filter", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new Queryable(array);

        expect(4).to.eq(result.lastOrDefault(i => i % 2 == 0));
    });

    it("should return null if the Queryable is empty", () =>
    {
        const array = [];
        const result = new Queryable(array);

        expect(null).to.eq(result.lastOrDefault());
    });
});

describe("Max", () =>
{
    it("should return the max of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new Queryable(array);

        const result = query.max((i) => i);

        expect(4).to.eq(result);
    });
});

describe("Min", () =>
{
    it("should return the min of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new Queryable(array);

        const result = query.min((i) => i);

        expect(1).to.eq(result);
    });
});

describe("OfType", () =>
{
    class BaseClass
    {
        public get property() { return "base value"; }
    }

    class DerivedClass extends BaseClass
    {
        public get property() { return "derived value"; }
    }

    class DerivedClass2 extends DerivedClass
    {
        public get property() { return "derived 2 value"; }
    }

    it("should return the items that match the type", () =>
    {
        const array: BaseClass[] = [
            new BaseClass(),
            new DerivedClass(),
            new BaseClass(),
            new DerivedClass2(),
            new DerivedClass()
        ];

        const query = new Queryable(array);
        const result = query.ofType(DerivedClass);

        expect(3).to.eq(result.count);

        expect("derived value").to.eq(result.item(0).property);
        expect("derived 2 value").to.eq(result.item(1).property);
        expect("derived value").to.eq(result.item(2).property);
    });
});

describe("OrderBy", () =>
{
    it("should return the items in ascending order", () =>
    {
        const array = [1, 4, 2, 3];
        const query = new Queryable(array);
        const expected = [1, 2, 3, 4];

        const result = query.orderBy((i) => i);

        for (let i = 0; i < result.count; i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return the items in descending order", () =>
    {
        const array = [1, 4, 2, 3];
        const query = new Queryable(array);
        const expected = [4, 3, 2, 1];

        const result = query.orderByDescending((i) => i);

        for (let i = 0; i < result.count; i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});

describe("Skip", () =>
{
    it("should return the items after the skip length (2)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new Queryable(array);
        const expected = [3, 4];

        const result = query.skip(2);

        for (let i = 0; i < result.count; i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return the items after the skip length (0)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new Queryable(array);
        const expected = [1, 2, 3, 4];

        const result = query.skip(0);

        for (let i = 0; i < result.count; i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return the items after the skip length (4)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new Queryable(array);
        const expected = [];

        const result = query.skip(4);

        for (let i = 0; i < result.count; i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});

describe("Select", () =>
{
    it("should return a map of the set 1", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new Queryable(array);
        const expected = [1, 2, 3, 4];

        const result = query.select((i) => i);

        for (let i = 0; i < result.count; i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return a map of the set 2", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new Queryable(array);
        const expected = [2, 4, 6, 8];

        const result = query.select((i) => i * 2);

        for (let i = 0; i < result.count; i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});

describe("Sum", () =>
{
    it("should return the sum of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new Queryable(array);

        const result = query.sum((i) => i);

        expect(10).to.eq(result);
    });
});

describe("Take", () =>
{
    it("should return a subset of items of the specified length (2)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new Queryable(array);
        const expected = [1, 2];

        const result = query.take(2);

        for (let i = 0; i < result.count; i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return a subset of items of the specified length (0)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new Queryable(array);
        const expected = [];

        const result = query.take(0);

        for (let i = 0; i < result.count; i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return a subset of items of the specified length (4)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new Queryable(array);
        const expected = [1, 2, 3, 4];

        const result = query.take(4);

        for (let i = 0; i < result.count; i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});
