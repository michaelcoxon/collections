import { getDefaultLogger } from "@michaelcoxon/utilities/lib/ILogger";
import Numbers from "@michaelcoxon/utilities/lib/Numbers";
import { assert, expect } from "chai";
import "mocha";
import Enumerable, { ArrayEnumerable } from "../src/Enumerables";

/*
setDefaultLogger(new ConsoleLogger(console, {
    loggingVerbosity: LogLevel.Trace,
    useTraceMethodForTraceLogLevel: false
}));
*/
const logger = getDefaultLogger();

describe("Enumerable", () =>
{
    it("should return a Enumerable with the array items in the same order", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(array.length).eq(result.count());

        for (let i = 0; i < result.count(); i++)
        {
            expect(result.item(i)).eq(array[i], `index ${i} is not the same`);
        }
    });

    it("should return an Enumerable with the List items in the same order", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(array.length).eq(result.count());

        for (let i = 0; i < result.count(); i++)
        {
            expect(result.item(i)).eq(array[i], `index ${i} is not the same`);
        }
    });

    it("should be able to be enumerated with for(..of..)", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(array.length).eq(result.count());
        let i = 0;
        for (const value of result)
        {
            expect(value).eq(array[i], `index ${i} is not the same`);
            i++;
        }
        expect(i).eq(array.length);
    });

    it("should return an empty enumerable", () =>
    {
        const source = Enumerable.empty();

        expect(source.count()).eq(0);
    });
});

describe("Enumerable.all", () =>
{
    it("should return true if all items match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(result.all((i) => i > 0)).to.eq(true);
    });

    it("should return false if one item doesnt match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(result.all((i) => i > 1)).to.eq(false);
    });
});

describe("Enumerable.any", () =>
{
    it("should return true if the Enumerable has items", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(result.any()).to.eq(true);
    });

    it("should return false if the Enumerable is empty", () =>
    {
        const array = [];
        const result = new ArrayEnumerable(array);

        expect(result.any()).to.eq(false);
    });

    it("should return true if any of the items match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(result.any((i) => i === 2)).to.eq(true);
    });

    it("should return false if none of the items match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(result.any((i) => i === -1)).to.eq(false);
    });
});

describe("Enumerable.average", () =>
{
    it("should return the average of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array);

        const result = query.average((i) => i);

        expect(result).to.eq(2.5);
    });
});

describe("Enumerable.count", () =>
{
    it("should return the number of items in the Enumerable", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array);

        const result = query.count();

        expect(result).to.eq(4);
    });
});

describe("Enumerable.distinct", () =>
{
    it("should return only unique items in the collection", () =>
    {
        const array = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4];
        const query = new ArrayEnumerable(array);
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

describe("Enumerable.first", () =>
{
    it("should return the first item in the Enumerable", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(result.first()).to.eq(1);
    });

    it("should return the first item in the Enumerable after applying the filter", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(result.first(i => i % 2 === 0)).to.eq(2);
    });

    it("should throw an exception if the Enumerable is empty", () =>
    {
        const array = [];
        const result = new ArrayEnumerable(array);

        try
        {
            result.first();
            assert.fail(undefined, undefined, "For some reason the Enumerable is not empty");
        }
        catch (ex) { }
    });
});

describe("Enumerable.firstOrDefault", () =>
{
    it("should return the first item in the Enumerable", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(1).to.eq(result.firstOrDefault());
    });

    it("should return the first item in the Enumerable after applying the filter", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(2).to.eq(result.firstOrDefault(i => i % 2 === 0));
    });

    it("should return null if the Enumerable is empty", () =>
    {
        const array = [];
        const result = new ArrayEnumerable(array);

        expect(null).to.eq(result.firstOrDefault());
    });
});

/*
describe("Enumerable.join", () =>
{
    it("should return the items joined by the selector", () =>
    {
        const outer = [1, 2, 3, 4, 5, 6];
        const inner = [2, 4, 6, 8];
        const expected = [2, 4, 6];

        const qOuter = new ArrayEnumerable(outer);
        const qInner = new ArrayEnumerable(inner);

        const outerKeySelector: (o: number) => number = o =>
        {
            console.log('o', o);
            return o;
        };
        const innerKeySelector: (i: number) => number = i =>
        {
            console.log('i', i);
            return i;
        };
        const resultSelector: (o: number, i: number) => { o: number, i: number; } = (o, i) =>
        {
            console.log('{o,i}', { o, i });
            return { o, i };
        };

        const result = qOuter.join(qInner, outerKeySelector, innerKeySelector, resultSelector);

        expect(result.count()).to.eq(expected.length);

        result.forEach(i => assert.equal(i.i, i.o, 'awee bugger'));
    });
});
*/

describe("Enumerable.groupBy", () =>
{
    it("should return the items grouped by the selector", () =>
    {
        const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const query = new ArrayEnumerable(array);

        const result = query.groupBy(i => i % 2);

        expect(2).to.eq(result.count());

        result.select(g => g.key).forEach(i => assert.oneOf(i, [0, 1]));

        assert.sameOrderedMembers(result.where(g => g.key === 0).single().toArray(), [2, 4, 6, 8, 10]);
        assert.sameOrderedMembers(result.where(g => g.key === 1).single().toArray(), [1, 3, 5, 7, 9]);

    });
});

describe("Enumerable.last", () =>
{
    it("should return the last item in the Enumerable", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(4).to.eq(result.last());
    });

    it("should return the last item in the Enumerable after applying the filter", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(3).to.eq(result.last(i => i % 2 !== 0));
    });

    it("should throw an exception if the Enumerable is empty", () =>
    {
        const array = [];
        const result = new ArrayEnumerable(array);

        try
        {
            result.last();
            assert.fail(undefined, undefined, "For some reason the Enumerable is not empty");
        }
        catch (ex) { }
    });
});

describe("Enumerable.lastOrDefault", () =>
{
    it("should return the last item in the Enumerable", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(4).to.eq(result.lastOrDefault());
    });

    it("should return the last item in the Enumerable after applying the filter", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new ArrayEnumerable(array);

        expect(4).to.eq(result.lastOrDefault(i => i % 2 === 0));
    });

    it("should return null if the Enumerable is empty", () =>
    {
        const array = [];
        const result = new ArrayEnumerable(array);

        expect(null).to.eq(result.lastOrDefault());
    });
});

describe("Enumerable.max", () =>
{
    it("should return the max of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array);

        const result = query.max((i) => i);

        expect(4).to.eq(result);
    });
});

describe("Enumerable.min", () =>
{
    it("should return the min of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array);

        const result = query.min((i) => i);

        expect(result).to.eq(1);
    });
});

describe("Enumerable.ofType", () =>
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

        const query = new ArrayEnumerable(array);
        const result = query.ofType(DerivedClass);

        expect(result.count()).to.eq(3);

        expect(result.item(0)!.property).to.eq("derived value");
        expect(result.item(1)!.property).to.eq("derived 2 value");
        expect(result.item(2)!.property).to.eq("derived value");
    });
});

describe("Enumerable.orderBy", () =>
{
    it("should return the items in ascending order", () =>
    {
        const array = [1, 4, 2, 3];
        const query = new ArrayEnumerable(array);
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
        const query = new ArrayEnumerable(array);
        const expected = [4, 3, 2, 1];

        const result = query.orderByDescending((i) => i);

        for (let i = 0; i < result.count(); i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});

describe("Enumerable.skip", () =>
{
    it("should return the items after the skip length (2)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array);
        const expected = [3, 4];

        const result = query.skip(2);

        for (let i = 0; i < result.count(); i++)
        {
            expect(result.item(i)).eq(expected[i], `index ${i} is not the same`);
        }
    });

    it("should return the items after the skip length (0)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array);
        const expected = [1, 2, 3, 4];

        const result = query.skip(0);

        for (let i = 0; i < result.count(); i++)
        {
            expect(result.item(i)).eq(expected[i], `index ${i} is not the same`);
        }
    });

    it("should return the items after the skip length (4)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array);
        const expected = [];

        const result = query.skip(4);

        for (let i = 0; i < result.count(); i++)
        {
            expect(result.item(i)).eq(expected[i], `index ${i} is not the same`);
        }
    });
});

describe("Enumerable.select", () =>
{
    it("should return a map of the set 1", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array);
        const expected = [1, 2, 3, 4];

        const result = query.select((i) => i);

        for (let i = 0; i < result.count(); i++)
        {
            expect(result.item(i)).eq(expected[i], `index ${i} is not the same`);
        }
    });

    it("should return a map of the set 2", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array);
        const expected = [2, 4, 6, 8];

        const result = query.select((i) => i * 2);

        for (let i = 0; i < result.count(); i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});

describe("Enumerable.selectMany", () =>
{
    it("should return a flat map of the set 1", () =>
    {
        const array = [[1], [2], [3], [4]];
        const query = new ArrayEnumerable(array);
        const expected = [1, 2, 3, 4];

        const result = query.selectMany(i => new ArrayEnumerable(i));

        for (let i = 0; i < result.count(); i++)
        {
            expect(result.item(i)).eq(expected[i], `index ${i} is not the same`);
        }
    });

    it("should return a flat map of the set 1.2", () =>
    {
        const array = [new ArrayEnumerable([1, 2, 3]), new ArrayEnumerable([4, 5])];
        const query = new ArrayEnumerable(array);
        const expected = [1, 2, 3, 4, 5];

        const result = query.selectMany(i => i);

        for (let i = 0; i < result.count(); i++)
        {
            expect(result.item(i)).eq(expected[i], `index ${i} is not the same`);
        }
    });

    it("should return a flat map of the set 2", () =>
    {
        const array = [[1, 2], [2, 3], [3, 4], [4, 5]];
        const query = new ArrayEnumerable(array);
        const expected = [1, 2, 2, 3, 3, 4, 4, 5];

        const result = query.selectMany(i => new ArrayEnumerable(i));

        for (let i = 0; i < result.count(); i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

});


describe("Enumerable.sum", () =>
{
    it("should return the sum of the numbers", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array);

        const result = query.sum((i) => i);

        expect(10).to.eq(result);
    });
});

describe("Enumerable.take", () =>
{
    it("should return a subset of items of the specified length (2)", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array);
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
        const query = new ArrayEnumerable(array);
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
        const query = new ArrayEnumerable(array);
        const expected = [1, 2, 3, 4];

        const result = query.take(4);

        for (let i = 0; i < result.count(); i++)
        {
            expect(expected[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});

describe("Enumerable.where", () =>
{
    it("should return the items that match the predicate", () =>
    {
        const array = [1, 2, 3, 4];
        const query = new ArrayEnumerable(array);

        const result = query.where((i) => Numbers.isEven(i));

        expect(result.count()).to.eq(2);

        expect(result.item(0)).to.eq(2);
        expect(result.item(1)).to.eq(4);
    });
});

describe("Enumerable Big sets", () =>
{
    it("should select all even numbers", (done) =>
    {
        logger.trace(`init: ${new Date().getTime()}`);

        const enumerable = Enumerable.range(1, 1000000);
        logger.trace(`enumerable: ${new Date().getTime()}`);

        const query = enumerable;
        logger.trace(`query: ${new Date().getTime()}`);

        const evenNumbers = query.where(i => Numbers.isEven(i));
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

describe("Enumerable.range", () =>
{
    it("should return an enumerable of numbers from 1 to 10 (slow)", () =>
    {
        const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = Enumerable.range(1, 10);

        for (let i = 0; i < expected.length; i++)
        {
            expect(actual.item(i)).eq(expected[i], `index ${i} is not the same`);
        }
    });

    it("should return an enumerable of numbers from -10 to 10 (slow)", () =>
    {
        const expected = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = Enumerable.range(-10, 21);

        for (let i = 0; i < expected.length; i++)
        {
            expect(actual.item(i)).eq(expected[i], `index ${i} is not the same`);
        }
    });

    it("should return an enumerable of numbers from 1 to 10 (fast)", () =>
    {
        const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = Enumerable.range(1, 10).toArray();

        for (let i = 0; i < expected.length; i++)
        {
            expect(actual[i]).eq(expected[i], `index ${i} is not the same`);
        }
    });

    it("should return an enumerable of numbers from -10 to 10 (slow)", () =>
    {
        const expected = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = Enumerable.range(-10, 21).toArray();

        for (let i = 0; i < expected.length; i++)
        {
            expect(actual[i]).eq(expected[i], `index ${i} is not the same`);
        }
    });

    it("should throw an exception saying that only integers are supported", (done) =>
    {
        try
        {
            const actual = Enumerable.range(1.1, 10);
            assert.fail();
        }
        catch
        {
            done();
        }
    });
});
