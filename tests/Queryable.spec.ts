﻿import { Numbers, setDefaultLogger, ConsoleLogger, LogLevel, getDefaultLogger } from "@michaelcoxon/utilities";
/*
setDefaultLogger(new ConsoleLogger(console, {
    loggingVerbosity: LogLevel.Trace,
    useTraceMethodForTraceLogLevel: false
}));
*/
import { ArrayEnumerable, Collection } from "../src/BaseCollections";
import { Enumerable } from "../src/Enumerables/Enumerable";
import { expect, assert } from 'chai';
import 'mocha';

const logger = getDefaultLogger();

describe("Create a Queryable", () =>
{
    it("should return a Queryable with the array items in the same order", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(array.length).eq(result.count());

        for (let i = 0; i < result.count(); i++)
        {
            expect(array[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return a Queryable with the List items in the same order", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(array.length).eq(result.count());

        for (let i = 0; i < result.count(); i++)
        {
            expect(array[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});

describe("All", () =>
{
    it("should return true if all items match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(true).to.eq(result.all((i) => i > 0));
    });

    it("should return false if one item doesnt match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(false).to.eq(result.all((i) => i > 1));
    });
});

describe("Any", () =>
{
    it("should return true if the queryable has items", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(true).to.eq(result.any());
    });

    it("should return false if the queryable is empty", () =>
    {
        const array = [];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(false).to.eq(result.any());
    });

    it("should return true if any of the items match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(true).to.eq(result.any((i) => i == 2));
    });

    it("should return false if none of the items match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(false).to.eq(result.any((i) => i == -1));
    });
});

describe("Average", () =>
{
    it("should return the average of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();

        const result = query.average((i) => i);

        expect(2.5).to.eq(result);
    });
});

describe("Distinct", () =>
{
    it("should return only unique items in the collection", () =>
    {
        const array = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();
        const expected = [1, 2, 3, 4];

        expect(query.count()).eq(array.length);

        const result = query.distinct((n) => n);

        expect(result.count()).eq(expected.length);

        for (let i = 0; i < result.count(); i++)
        {
            expect(result.item(i)).eq(expected[i], `index ${i} is not the same`);
        }
    });
});

describe("First", () =>
{
    it("should return the first item in the Queryable", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(1).to.eq(result.first());
    });

    it("should return the first item in the Queryable after applying the filter", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(2).to.eq(result.first(i => i % 2 == 0));
    });

    it("should throw an exception if the Queryable is empty", () =>
    {
        const array = [];
        const result = new ArrayEnumerable(array).asQueryable();

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
        const result = new ArrayEnumerable(array).asQueryable();

        expect(1).to.eq(result.firstOrDefault());
    });

    it("should return the first item in the Queryable after applying the filter", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(2).to.eq(result.firstOrDefault(i => i % 2 == 0));
    });

    it("should return null if the Queryable is empty", () =>
    {
        const array = [];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(null).to.eq(result.firstOrDefault());
    });
});

describe("Last", () =>
{
    it("should return the last item in the Queryable", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(4).to.eq(result.last());
    });

    it("should return the last item in the Queryable after applying the filter", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(3).to.eq(result.last(i => i % 2 != 0));
    });

    it("should throw an exception if the Queryable is empty", () =>
    {
        const array = [];
        const result = new ArrayEnumerable(array).asQueryable();

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
        const result = new ArrayEnumerable(array).asQueryable();

        expect(4).to.eq(result.lastOrDefault());
    });

    it("should return the last item in the Queryable after applying the filter", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(4).to.eq(result.lastOrDefault(i => i % 2 == 0));
    });

    it("should return null if the Queryable is empty", () =>
    {
        const array = [];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(null).to.eq(result.lastOrDefault());
    });
});

describe("Max", () =>
{
    it("should return the max of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();

        const result = query.max((i) => i);

        expect(4).to.eq(result);
    });
});

describe("Min", () =>
{
    it("should return the min of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();

        const result = query.min((i) => i);

        expect(result).to.eq(1);
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

        const query = new ArrayEnumerable(array).asQueryable();
        const result = query.ofType(DerivedClass);

        expect(result.count()).to.eq(3);

        expect(result.item(0)!.property).to.eq("derived value");
        expect(result.item(1)!.property).to.eq("derived 2 value");
        expect(result.item(2)!.property).to.eq("derived value");
    });
});

describe("OrderBy", () =>
{
    it("should return the items in ascending order", () =>
    {
        const array = [1, 4, 2, 3];
        const query = new ArrayEnumerable(array).asQueryable();
        const expected = [1, 2, 3, 4];

        const result = query.orderBy((i) => i);

        for (let i = 0; i < result.count(); i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return the items in descending order", () =>
    {
        const array = [1, 4, 2, 3];
        const query = new ArrayEnumerable(array).asQueryable();
        const expected = [4, 3, 2, 1];

        const result = query.orderByDescending((i) => i);

        for (let i = 0; i < result.count(); i++)
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
        const query = new ArrayEnumerable(array).asQueryable();
        const expected = [3, 4];

        const result = query.skip(2);

        for (let i = 0; i < result.count(); i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return the items after the skip length (0)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();
        const expected = [1, 2, 3, 4];

        const result = query.skip(0);

        for (let i = 0; i < result.count(); i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return the items after the skip length (4)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();
        const expected = [];

        const result = query.skip(4);

        for (let i = 0; i < result.count(); i++)
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
        const query = new ArrayEnumerable(array).asQueryable();
        const expected = [1, 2, 3, 4];

        const result = query.select((i) => i);

        for (let i = 0; i < result.count(); i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return a map of the set 2", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();
        const expected = [2, 4, 6, 8];

        const result = query.select((i) => i * 2);

        for (let i = 0; i < result.count(); i++)
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
        const query = new ArrayEnumerable(array).asQueryable();

        const result = query.sum((i) => i);

        expect(10).to.eq(result);
    });
});

describe("Take", () =>
{
    it("should return a subset of items of the specified length (2)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();
        const expected = [1, 2];

        const result = query.take(2);

        for (let i = 0; i < result.count(); i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return a subset of items of the specified length (0)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();
        const expected = [];

        const result = query.take(0);

        for (let i = 0; i < result.count(); i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return a subset of items of the specified length (4)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();
        const expected = [1, 2, 3, 4];

        const result = query.take(4);

        for (let i = 0; i < result.count(); i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});

describe("Where", () =>
{
    it("should return the items that match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();

        const result = query.where((i) => Numbers.isEven(i));

        expect(result.count()).to.eq(2);

        expect(result.item(0)).to.eq(2);
        expect(result.item(1)).to.eq(4);
    });
});


describe("Big sets", () =>
{
    it("should select all even numbers", (done) =>
    {
        logger.trace(`init: ${new Date().getTime()}`);

        const enumerable = Enumerable.range(1, 1000000);
        logger.trace(`enumerable: ${new Date().getTime()}`);

        const query = enumerable.asQueryable();
        logger.trace(`query: ${new Date().getTime()}`);

        const evenNumbers = query.where(i => Numbers.isEven(i))
        logger.trace(`evenNumbers: ${new Date().getTime()}`);

        const result = evenNumbers.toArray();
        logger.trace(`result: ${new Date().getTime()}`);
        /*
        for (let i = 0; i < result.length; i++)
        {
            assert.isTrue(Numbers.isEven(result[i]));
        }
        */
        done();
    })
        .timeout(0);

    it("should select all even numbers (built-in)", (done) =>
    {
        const array = Array.from(Array(1000001).keys());

        array.shift();

        const result = array.filter(i => Numbers.isEven(i));
        /*
        for (let i = 0; i < result.length; i++)
        {
            assert.isTrue(Numbers.isEven(result[i]));
        }
        */
        done();
    })
        .timeout(0);
});