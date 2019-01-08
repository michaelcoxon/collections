import { assert, expect } from 'chai';
import 'mocha';
import { CaseInsensitiveStringComparer } from '../src/Comparers/CaseInsensitiveStringComparer';

describe("CaseInsensitiveStringComparer.compare", () =>
{
    it("should equal 1", () =>
    {
        const x = 'BCd';
        const y = 'abc';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.compare(x, y);

        expect(1).to.equal(result);
    });

    it("should equal 0", () =>
    {
        const x = 'Abc';
        const y = 'aBc';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.compare(x, y);

        expect(0).to.equal(result);
    });

    it("should equal -1", () =>
    {
        const x = 'AbC';
        const y = 'bcd';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.compare(x, y);

        expect(-1).to.equal(result);
    });
});

describe("CaseInsensitiveStringComparer.equals", () =>
{
    it("should be equal", () =>
    {
        const x = 'aBc';
        const y = 'abC';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.equals(x, y);

        expect(true).to.equal(result);
    });

    it("should not be equal", () =>
    {
        const x = 'abC';
        const y = 'cBa';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.equals(x, y);

        expect(false).to.equal(result);
    });
});

describe("CaseInsensitiveStringComparer.greaterThan", () =>
{
    it("should be greater than", () =>
    {
        const x = 'bcD';
        const y = 'aBc';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.greaterThan(x, y);

        expect(true).to.equal(result);
    });

    it("should not be greater than", () =>
    {
        const x = 'aBc';
        const y = 'bcD';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.greaterThan(x, y);

        expect(false).to.equal(result);
    });

    it("should not be greater than (equal)", () =>
    {
        const x = 'abC';
        const y = 'Abc';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.greaterThan(x, y);

        expect(false).to.equal(result);
    });
});

describe("CaseInsensitiveStringComparer.greaterThanOrEqual", () =>
{
    it("should be greater than or equal", () =>
    {
        const x = 'Bcd';
        const y = 'aBc';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.greaterThanOrEqual(x, y);

        expect(true).to.equal(result);
    });

    it("should not be greater than or equal", () =>
    {
        const x = 'abC';
        const y = 'Bcd';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.greaterThanOrEqual(x, y);

        expect(false).to.equal(result);
    });

    it("should be greater than or equal (equal)", () =>
    {
        const x = 'Abc';
        const y = 'abC';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.greaterThanOrEqual(x, y);

        expect(true).to.equal(result);
    });
});

describe("CaseInsensitiveStringComparer.lessThan", () =>
{
    it("should not be less than", () =>
    {
        const x = 'bcD';
        const y = 'aBc';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.lessThan(x, y);

        expect(false).to.equal(result);
    });

    it("should be less than", () =>
    {
        const x = 'Abc';
        const y = 'BCd';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.lessThan(x, y);

        expect(true).to.equal(result);
    });

    it("should not be less than (equal)", () =>
    {
        const x = 'bCd';
        const y = 'Bcd';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.lessThan(x, y);

        expect(false).to.equal(result);
    });
});

describe("CaseInsensitiveStringComparer.lessThanOrEqual", () =>
{
    it("should not be less than or equal", () =>
    {
        const x = 'Bcd';
        const y = 'abC';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.lessThanOrEqual(x, y);

        expect(false).to.equal(result);
    });

    it("should be less than or equal", () =>
    {
        const x = 'Abc';
        const y = 'bCD';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.lessThanOrEqual(x, y);

        expect(true).to.equal(result);
    });

    it("should be less than or equal (equal)", () =>
    {
        const x = 'abc';
        const y = 'ABC';
        const comparer = new CaseInsensitiveStringComparer();

        const result = comparer.lessThanOrEqual(x, y);

        expect(true).to.equal(result);
    });
});
