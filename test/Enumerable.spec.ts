import { setDefaultLogger, ConsoleLogger, LogLevel } from '@michaelcoxon/utilities';
import { expect, assert } from 'chai';
import 'mocha';
import Enumerable  from "../src/Enumerables/Enumerable";
/*
setDefaultLogger(new ConsoleLogger(console, {
    loggingVerbosity: LogLevel.Trace,
    useTraceMethodForTraceLogLevel: false
}));
*/
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
