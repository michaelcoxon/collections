import { assert, expect } from 'chai';
import 'mocha';
import { DefaultComparers } from '../src/Comparers/DefaultComparer';

describe("DefaultStringComparer.compare", () =>
{
    it("should equal 1", () =>
    {
        const x = 'bcd';
        const y = 'abc';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.compare(x, y);

        expect(1).to.equal(result);
    });

    it("should equal 0", () =>
    {
        const x = 'abc';
        const y = 'abc';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.compare(x, y);

        expect(0).to.equal(result);
    });

    it("should equal -1", () =>
    {
        const x = 'abc';
        const y = 'bcd';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.compare(x, y);

        expect(-1).to.equal(result);
    });
});

describe("DefaultStringComparer.equals", () =>
{
    it("should be equal", () =>
    {
        const x = 'abc';
        const y = 'abc';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.equals(x, y);

        expect(true).to.equal(result);
    });

    it("should not be equal", () =>
    {
        const x = 'abc';
        const y = 'cba';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.equals(x, y);

        expect(false).to.equal(result);
    });
});

describe("DefaultStringComparer.greaterThan", () =>
{
    it("should be greater than", () =>
    {
        const x = 'bcd';
        const y = 'abc';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.greaterThan(x, y);

        expect(true).to.equal(result);
    });

    it("should not be greater than", () =>
    {
        const x = 'abc';
        const y = 'bcd';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.greaterThan(x, y);

        expect(false).to.equal(result);
    });

    it("should not be greater than (equal)", () =>
    {
        const x = 'abc';
        const y = 'abc';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.greaterThan(x, y);

        expect(false).to.equal(result);
    });
});

describe("DefaultStringComparer.greaterThanOrEqual", () =>
{
    it("should be greater than or equal", () =>
    {
        const x = 'bcd';
        const y = 'abc';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.greaterThanOrEqual(x, y);

        expect(true).to.equal(result);
    });

    it("should not be greater than or equal", () =>
    {
        const x = 'abc';
        const y = 'bcd';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.greaterThanOrEqual(x, y);

        expect(false).to.equal(result);
    });

    it("should be greater than or equal (equal)", () =>
    {
        const x = 'abc';
        const y = 'abc';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.greaterThanOrEqual(x, y);

        expect(true).to.equal(result);
    });
});

describe("DefaultStringComparer.lessThan", () =>
{
    it("should not be less than", () =>
    {
        const x = 'bcd';
        const y = 'abc';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.lessThan(x, y);

        expect(false).to.equal(result);
    });

    it("should be less than", () =>
    {
        const x = 'abc';
        const y = 'bcd';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.lessThan(x, y);

        expect(true).to.equal(result);
    });

    it("should not be less than (equal)", () =>
    {
        const x = 'bcd';
        const y = 'bcd';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.lessThan(x, y);

        expect(false).to.equal(result);
    });
});

describe("DefaultStringComparer.lessThanOrEqual", () =>
{
    it("should not be less than or equal", () =>
    {
        const x = 'bcd';
        const y = 'abc';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.lessThanOrEqual(x, y);

        expect(false).to.equal(result);
    });

    it("should be less than or equal", () =>
    {
        const x = 'abc';
        const y = 'bcd';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.lessThanOrEqual(x, y);

        expect(true).to.equal(result);
    });

    it("should be less than or equal (equal)", () =>
    {
        const x = 'abc';
        const y = 'abc';
        const comparer = DefaultComparers.StringComparer;

        const result = comparer.lessThanOrEqual(x, y);

        expect(true).to.equal(result);
    });
});
