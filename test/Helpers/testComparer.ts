import { assert, expect } from 'chai';
import 'mocha';
import { IComparer } from '../../src/Interfaces/IComparer';

export default function testComparer<T>(
    name: string,
    comparerFactory: () => IComparer<T>,
    xIsLess: { x: T, y: T; },
    sameValue: { x: T, y: T; },
    xIsMore: { x: T, y: T; },
)
{

    describe(`${name}.compare`, () =>
    {
        it("should equal 1", () =>
        {
            const { x, y } = xIsMore;
            const comparer = comparerFactory();

            const result = comparer.compare(x, y);

            expect(result).greaterThan(0);
        });

        it("should equal 0", () =>
        {
            const { x, y } = sameValue;
            const comparer = comparerFactory();

            const result = comparer.compare(x, y);

            expect(result).equal(0);
        });

        it("should equal -1", () =>
        {
            const { x, y } = xIsLess;
            const comparer = comparerFactory();

            const result = comparer.compare(x, y);

            expect(result).lessThan(0);
        });
    });

    describe(`${name}.equals`, () =>
    {
        it("should be equal", () =>
        {
            const { x, y } = sameValue;
            const comparer = comparerFactory();

            const result = comparer.equals(x, y);

            expect(true).to.equal(result);
        });

        it("should not be equal", () =>
        {
            const { x, y } = xIsLess;
            const comparer = comparerFactory();

            const result = comparer.equals(x, y);

            expect(false).to.equal(result);
        });
    });

    describe(`${name}.greaterThan`, () =>
    {
        it("should be greater than", () =>
        {
            const { x, y } = xIsMore;
            const comparer = comparerFactory();

            const result = comparer.greaterThan(x, y);

            expect(true).to.equal(result);
        });

        it("should not be greater than", () =>
        {
            const { x, y } = xIsLess;
            const comparer = comparerFactory();

            const result = comparer.greaterThan(x, y);

            expect(false).to.equal(result);
        });

        it("should not be greater than (equal)", () =>
        {
            const { x, y } = sameValue;
            const comparer = comparerFactory();

            const result = comparer.greaterThan(x, y);

            expect(false).to.equal(result);
        });
    });

    describe(`${name}.greaterThanOrEqual`, () =>
    {
        it("should be greater than or equal", () =>
        {
            const { x, y } = xIsMore;
            const comparer = comparerFactory();

            const result = comparer.greaterThanOrEqual(x, y);

            expect(true).to.equal(result);
        });

        it("should not be greater than or equal", () =>
        {
            const { x, y } = xIsLess;
            const comparer = comparerFactory();

            const result = comparer.greaterThanOrEqual(x, y);

            expect(false).to.equal(result);
        });

        it("should be greater than or equal (equal)", () =>
        {
            const { x, y } = sameValue;
            const comparer = comparerFactory();

            const result = comparer.greaterThanOrEqual(x, y);

            expect(true).to.equal(result);
        });
    });

    describe(`${name}.lessThan`, () =>
    {
        it("should not be less than", () =>
        {
            const { x, y } = xIsMore;
            const comparer = comparerFactory();

            const result = comparer.lessThan(x, y);

            expect(false).to.equal(result);
        });

        it("should be less than", () =>
        {
            const { x, y } = xIsLess;
            const comparer = comparerFactory();

            const result = comparer.lessThan(x, y);

            expect(true).to.equal(result);
        });

        it("should not be less than (equal)", () =>
        {
            const { x, y } = sameValue;
            const comparer = comparerFactory();

            const result = comparer.lessThan(x, y);

            expect(false).to.equal(result);
        });
    });

    describe(`${name}.lessThanOrEqual`, () =>
    {
        it("should not be less than or equal", () =>
        {
            const { x, y } = xIsMore;
            const comparer = comparerFactory();

            const result = comparer.lessThanOrEqual(x, y);

            expect(false).to.equal(result);
        });

        it("should be less than or equal", () =>
        {
            const { x, y } = xIsLess;
            const comparer = comparerFactory();

            const result = comparer.lessThanOrEqual(x, y);

            expect(true).to.equal(result);
        });

        it("should be less than or equal (equal)", () =>
        {
            const { x, y } = sameValue;
            const comparer = comparerFactory();

            const result = comparer.lessThanOrEqual(x, y);

            expect(true).to.equal(result);
        });
    });

}