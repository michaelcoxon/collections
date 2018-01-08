import { Collection } from '../src/Collection';
import { Enumerator } from '../src/Enumerator';
import { expect, assert } from 'chai';
import 'mocha';

describe("Create an enumerator", () =>
{
    it("should return an enumerator from a collection", () =>
    {
        const array = [1, 2, 3, 4];
        const coll = new Collection(array);
        const en = new Enumerator(coll);

        let count = 0;

        while (en.moveNext())
        {
            expect(coll.item(count)).eq(en.current, `index ${count} is not the same`);
            count++;
        }
    });

    it("should return an enumerator from an array", () =>
    {
        const array = [1, 2, 3, 4];
        const en = new Enumerator(array);

        let count = 0;

        while (en.moveNext())
        {
            expect(array[count]).eq(en.current, `index ${count} is not the same`);
            count++;
        }
    });

    it("should return an enumerator using the extension method", () =>
    {
        const array = [1, 2, 3, 4];
        const coll = new Collection(array);
        const en = coll.getEnumerator();

        let count = 0;

        while (en.moveNext())
        {
            expect(coll.item(count)).eq(en.current, `index ${count} is not the same`);
            count++;
        }
    });
});

describe("Move to the next item in an enumerator", () =>
{
    it("should move to the next item in the enumerator", () =>
    {
        const array = [1, 2, 3, 4];
        const coll = new Collection(array);
        const en = new Enumerator(coll);

        let count = 0;

        while (en.moveNext())
        {
            expect(coll.item(count)).eq(en.current, `index ${count} is not the same`);
            count++;
        }
    });

    it("should return false when moving past the end of the enumerator", () =>
    {
        const array = [1, 2, 3, 4];
        const coll = new Collection(array);
        const en = new Enumerator(coll);

        let count = 0;

        while (en.moveNext())
        {
            expect(coll.item(count)).eq(en.current, `index ${count} is not the same`);
            count++;
        }

        expect(false).to.eq(en.moveNext());
    });
});

describe("Peek at the next item in an enumerator", () =>
{
    it("should return the next item in the enumerator without advancing", () =>
    {
        const array = [1, 2, 3, 4];
        const coll = new Collection(array);
        const en = new Enumerator(coll);

        let count = 0;

        expect(1).to.eq(en.peek());

        while (en.moveNext())
        {
            expect(coll.item(count)).eq(en.current, `index ${count} is not the same`);
            count++;
        }
    });

    it("should throw an execption when cannot peek", () =>
    {
        const array = [1, 2, 3, 4];
        const coll = new Collection(array);
        const en = new Enumerator(coll);

        let count = 0;

        while (en.moveNext())
        {
            expect(coll.item(count)).eq(en.current, `index ${count} is not the same`);
            count++;
        }
        try
        {
            en.peek();
            assert.fail(undefined, undefined, "Should not be able to see past end of enumerable");
        } catch (ex) { }
    });
});

describe("Reset the enumerator", () =>
{
    it("should move to the start of the enumerator", () =>
    {
        const array = [1, 2, 3, 4];
        const coll = new Collection(array);
        const en = new Enumerator(coll);

        let count = 0;

        while (en.moveNext())
        {
            expect(coll.item(count)).eq(en.current, `index ${count} is not the same`);
            count++;
        }

        en.reset();

        count = 0;

        while (en.moveNext())
        {
            expect(coll.item(count)).eq(en.current, `index ${count} is not the same`);
            count++;
        }
    });
});

