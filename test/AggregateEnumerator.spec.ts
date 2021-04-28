import NullReferenceException from '@michaelcoxon/utilities/lib/Exceptions/NullReferenceException';
import { isNumber } from '@michaelcoxon/utilities/lib/TypeHelpers';
import { expect, assert } from 'chai';
import 'mocha';
import { Collection } from "../src/Enumerables";
import AggregateEnumerator from "../src/Enumerators/AggregateEnumerator";

describe("AggregateEnumerator.constructor", () =>
{
    it("should return an enumerator from a collection", () =>
    {
        const array1 = [1, 2, 3, 4];
        const expected = [1, 3, 6, 10];
        const coll1 = new Collection(array1);
        const en = new AggregateEnumerator(coll1.getEnumerator(), (a, c) => a + c, 0);

        let count = 0;

        while (en.moveNext())
        {
            expect(expected[count]).eq(en.current, `index ${count} is not the same`);
            count++;
        }
    });

    it("should return an enumerator from a collection dev should handle nulls or use initialValue", () =>
    {
        const array1 = [1, 2, 3, 4];
        const expected = [1, 3, 6, 10];
        const coll1 = new Collection(array1);
        const en = new AggregateEnumerator(coll1.getEnumerator(), (a, c) => isNumber(a) ? a + c : c);

        let count = 0;

        while (en.moveNext())
        {
            expect(expected[count]).eq(en.current, `index ${count} is not the same`);
            count++;
        }
    });
});

describe("AggregateEnumerator.peek", () =>
{
    it("should return the next item in the enumerator without advancing", () =>
    {
        const array1 = [1, 2, 3, 4];
        const expected = [1, 3, 6, 10];
        const coll1 = new Collection(array1);
        const en = new AggregateEnumerator(coll1.getEnumerator(), (a, c) => a + c, 0);

        let count = 0;

        expect(1).to.eq(en.peek());

        while (en.moveNext())
        {
            expect(expected[count]).eq(en.current, `index ${count} is not the same`);
            count++;
        }
    });

    it("should throw an execption when cannot peek", () =>
    {
        const array1 = [1, 2, 3, 4];
        const expected = [1, 3, 6, 10];
        const coll1 = new Collection(array1);
        const en = new AggregateEnumerator(coll1.getEnumerator(), (a, c) => a + c, 0);

        let count = 0;

        while (en.moveNext())
        {
            expect(expected[count]).eq(en.current, `index ${count} is not the same`);
            count++;
        }
        try
        {
            en.peek();
            assert.fail(undefined, undefined, "Should not be able to see past end of enumerable");
        } catch (ex) { }
    });
});

describe("AggregateEnumerator.reset", () =>
{
    it("should move to the start of the enumerator", () =>
    {
        const array1 = [1, 2, 3, 4];
        const expected = [1, 3, 6, 10];
        const coll1 = new Collection(array1);
        const en = new AggregateEnumerator(coll1.getEnumerator(), (a, c) => a + c, 0);

        let count = 0;

        while (en.moveNext())
        {
            expect(expected[count]).eq(en.current, `index ${count} is not the same`);
            count++;
        }

        en.reset();

        count = 0;

        while (en.moveNext())
        {
            expect(expected[count]).eq(en.current, `index ${count} is not the same`);
            count++;
        }
    });
});

describe("AggregateEnumerator throw NullReferenceException", () =>
{
    it("should throw NullReferenceException", () =>
    {
        const array1 = [1, 2, 3, 4];
        const expected = [1, 3, 6, 10];
        const coll1 = new Collection(array1);
        const en = new AggregateEnumerator<number, number>(coll1.getEnumerator(), (a, c) => a + c);

        assert.throws(() =>
        {
            en.current;
        },
            NullReferenceException);
    });
});