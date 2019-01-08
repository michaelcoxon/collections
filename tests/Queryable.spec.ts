

import { getDefaultLogger, Numbers } from "@michaelcoxon/utilities";
import { assert, expect } from 'chai';
import 'mocha';
import { ArrayEnumerable } from "../src/BaseCollections";
import { Enumerable } from "../src/Enumerables";
/*
setDefaultLogger(new ConsoleLogger(console, {
    loggingVerbosity: LogLevel.Trace,
    useTraceMethodForTraceLogLevel: false
}));
*/
const logger = getDefaultLogger();

describe("ArrayEnumerable.asQueryable", () =>
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

describe("Queryable.all", () =>
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

describe("Queryable.any", () =>
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

        expect(true).to.eq(result.any((i) => i === 2));
    });

    it("should return false if none of the items match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(false).to.eq(result.any((i) => i === -1));
    });
});

describe("Queryable.average", () =>
{
    it("should return the average of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();

        const result = query.average((i) => i);

        expect(2.5).to.eq(result);
    });
});

describe("Queryable.count", () =>
{
    it("should return the number of items in the queryable", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();

        const result = query.count();

        expect(4).to.eq(result);
    });
});

describe("Queryable.distinct", () =>
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

describe("Queryable.first", () =>
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

        expect(2).to.eq(result.first(i => i % 2 === 0));
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

describe("Queryable.firstOrDefault", () =>
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

        expect(2).to.eq(result.firstOrDefault(i => i % 2 === 0));
    });

    it("should return null if the Queryable is empty", () =>
    {
        const array = [];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(null).to.eq(result.firstOrDefault());
    });
});

describe("Queryable.groupBy", () =>
{
    it("should return the items grouped by the selector", () =>
    {
        const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const query = new ArrayEnumerable(array).asQueryable();

        const result = query.groupBy(i => i % 2);
       
        expect(2).to.eq(result.count());
               
        result.select(g => g.key).forEach(i => assert.oneOf(i, [0, 1]));

        assert.sameOrderedMembers(result.where(g => g.key === 0).single().toArray(), [2, 4, 6, 8, 10]);
        assert.sameOrderedMembers(result.where(g => g.key === 1).single().toArray(), [1, 3, 5, 7, 9]);
        
    });
});


describe("Queryable.last", () =>
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

        expect(3).to.eq(result.last(i => i % 2 !== 0));
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

describe("Queryable.lastOrDefault", () =>
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

        expect(4).to.eq(result.lastOrDefault(i => i % 2 === 0));
    });

    it("should return null if the Queryable is empty", () =>
    {
        const array = [];
        const result = new ArrayEnumerable(array).asQueryable();

        expect(null).to.eq(result.lastOrDefault());
    });
});

describe("Queryable.max", () =>
{
    it("should return the max of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();

        const result = query.max((i) => i);

        expect(4).to.eq(result);
    });
});

describe("Queryable.min", () =>
{
    it("should return the min of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();

        const result = query.min((i) => i);

        expect(result).to.eq(1);
    });
});

describe("Queryable.ofType", () =>
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

describe("Queryable.orderBy", () =>
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

describe("Queryable.skip", () =>
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

describe("Queryable.select", () =>
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

describe("Queryable.sum", () =>
{
    it("should return the sum of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array).asQueryable();

        const result = query.sum((i) => i);

        expect(10).to.eq(result);
    });
});

describe("Queryable.take", () =>
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

describe("Queryable.where", () =>
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


describe("Queryable Big sets", () =>
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

        done();
    })
        .timeout(0);

    it("should select all even numbers (built-in)", (done) =>
    {
        logger.trace(`init: ${new Date().getTime()}`);
        const array = Array.from(Array(1000001).keys());

        array.shift();

        logger.trace(`begin: ${new Date().getTime()}`);
        const result = array.filter(i => Numbers.isEven(i));
        logger.trace(`end: ${new Date().getTime()}`);

        done();
    })
        .timeout(0);
});