import { assert, expect } from 'chai';
import 'mocha';
import { DefaultNumberComparer } from '../src/Comparers/DefaultComparer';

describe("DefaultNumberComparer.compare", () =>
{
    it("should equal 1", () =>
    {
        const x = 10;
        const y = 0;
        const comparer = new DefaultNumberComparer();

        const result = comparer.compare(x, y);

        expect(1).to.equal(result);
    });

    it("should equal 0", () =>
    {
        const x = 10;
        const y = 10;
        const comparer = new DefaultNumberComparer();

        const result = comparer.compare(x, y);

        expect(0).to.equal(result);
    });

    it("should equal -1", () =>
    {
        const x = 0;
        const y = 10;
        const comparer = new DefaultNumberComparer();

        const result = comparer.compare(x, y);

        expect(-1).to.equal(result);
    });
});

describe("DefaultNumberComparer.equals", () =>
{
    it("should be equal", () =>
    {
        const x = 1;
        const y = 1;
        const comparer = new DefaultNumberComparer();

        const result = comparer.equals(x, y);

        expect(true).to.equal(result);
    });

    it("should not be equal", () =>
    {
        const x = 1;
        const y = 2;
        const comparer = new DefaultNumberComparer();

        const result = comparer.equals(x, y);

        expect(false).to.equal(result);
    });
});

describe("DefaultNumberComparer.greaterThan", () =>
{
    it("should be greater than", () =>
    {
        const x = 110;
        const y = 10;
        const comparer = new DefaultNumberComparer();

        const result = comparer.greaterThan(x, y);

        expect(true).to.equal(result);
    });

    it("should not be greater than", () =>
    {
        const x = 10;
        const y = 110;
        const comparer = new DefaultNumberComparer();

        const result = comparer.greaterThan(x, y);

        expect(false).to.equal(result);
    });

    it("should not be greater than (equal)", () =>
    {
        const x = 10;
        const y = 10;
        const comparer = new DefaultNumberComparer();

        const result = comparer.greaterThan(x, y);

        expect(false).to.equal(result);
    });
});

describe("DefaultNumberComparer.greaterThanOrEqual", () =>
{
    it("should be greater than or equal", () =>
    {
        const x = 110;
        const y = 10;
        const comparer = new DefaultNumberComparer();

        const result = comparer.greaterThanOrEqual(x, y);

        expect(true).to.equal(result);
    });

    it("should not be greater than or equal", () =>
    {
        const x = 10;
        const y = 110;
        const comparer = new DefaultNumberComparer();

        const result = comparer.greaterThanOrEqual(x, y);

        expect(false).to.equal(result);
    });

    it("should be greater than or equal (equal)", () =>
    {
        const x = 10;
        const y = 10;
        const comparer = new DefaultNumberComparer();

        const result = comparer.greaterThanOrEqual(x, y);

        expect(true).to.equal(result);
    });
});

describe("DefaultNumberComparer.lessThan", () =>
{
    it("should not be less than", () =>
    {
        const x = 110;
        const y = 10;
        const comparer = new DefaultNumberComparer();

        const result = comparer.lessThan(x, y);

        expect(false).to.equal(result);
    });

    it("should be less than", () =>
    {
        const x = 10;
        const y = 110;
        const comparer = new DefaultNumberComparer();

        const result = comparer.lessThan(x, y);

        expect(true).to.equal(result);
    });

    it("should not be less than (equal)", () =>
    {
        const x = 10;
        const y = 10;
        const comparer = new DefaultNumberComparer();

        const result = comparer.lessThan(x, y);

        expect(false).to.equal(result);
    });
});

describe("DefaultNumberComparer.lessThanOrEqual", () =>
{
    it("should not be less than or equal", () =>
    {
        const x = 110;
        const y = 10;
        const comparer = new DefaultNumberComparer();

        const result = comparer.lessThanOrEqual(x, y);

        expect(false).to.equal(result);
    });

    it("should be less than or equal", () =>
    {
        const x = 10;
        const y = 110;
        const comparer = new DefaultNumberComparer();

        const result = comparer.lessThanOrEqual(x, y);

        expect(true).to.equal(result);
    });

    it("should be less than or equal (equal)", () =>
    {
        const x = 10;
        const y = 10;
        const comparer = new DefaultNumberComparer();

        const result = comparer.lessThanOrEqual(x, y);

        expect(true).to.equal(result);
    });
});
