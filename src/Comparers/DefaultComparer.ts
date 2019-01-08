import { IComparer } from "../Interfaces/IComparer";
import { Utilities } from "@michaelcoxon/utilities";
import { IEqualityComparer } from '../Interfaces/IEqualityComparer';

export class DefaultComparer<T> implements IComparer<T>, IEqualityComparer<T>
{
    public compare(x: T, y: T): number
    {
        if (typeof x == 'string' && typeof y == 'string')
        {
            return _stringComparer.compare(x, y);
        }
        else if (typeof x == 'number' && typeof y == 'number')
        {
            return _numberComparer.compare(x, y);
        }
        else
        {
            return _objectComparer.compare(x, y);
        }
    }

    public equals(x: T, y: T): boolean
    {
        if (typeof x == 'string' && typeof y == 'string')
        {
            return _stringComparer.equals(x, y);
        }
        else if (typeof x == 'number' && typeof y == 'number')
        {
            return _numberComparer.equals(x, y);
        }
        else
        {
            return _objectComparer.equals(x, y);
        }
    }

    public greaterThan(x: T, y: T): boolean
    {
        return this.compare(x, y) > 0;
    }

    public greaterThanOrEqual(x: T, y: T): boolean
    {
        return this.compare(x, y) >= 0;
    }

    public lessThan(x: T, y: T): boolean
    {
        return this.compare(x, y) < 0;
    }

    public lessThanOrEqual(x: T, y: T): boolean
    {
        return this.compare(x, y) <= 0;
    }
}

export class DefaultStringComparer implements IComparer<string>, IEqualityComparer<string>
{
    public compare(x: string, y: string): number
    {
        if (x < y)
        {
            return -1;
        }

        if (x > y)
        {
            return 1;
        }

        return 0;
    }

    public equals(x: string, y: string): boolean
    {
        return x === y;
    }

    public greaterThan(x: string, y: string): boolean
    {
        return this.compare(x, y) > 0;
    }

    public greaterThanOrEqual(x: string, y: string): boolean
    {
        return this.compare(x, y) >= 0;
    }

    public lessThan(x: string, y: string): boolean
    {
        return this.compare(x, y) < 0;
    }

    public lessThanOrEqual(x: string, y: string): boolean
    {
        return this.compare(x, y) <= 0;
    }
}

export class DefaultNumberComparer implements IComparer<number>, IEqualityComparer<number>
{
    public compare(x: number, y: number): number
    {
        const result = x - y;

        if (result < 0) return -1;
        if (result > 0) return 1;
        return result;
    }

    public equals(x: number, y: number): boolean
    {
        return x === y;
    }

    public greaterThan(x: number, y: number): boolean
    {
        return this.compare(x, y) > 0;
    }

    public greaterThanOrEqual(x: number, y: number): boolean
    {
        return this.compare(x, y) >= 0;
    }

    public lessThan(x: number, y: number): boolean
    {
        return this.compare(x, y) < 0;
    }

    public lessThanOrEqual(x: number, y: number): boolean
    {
        return this.compare(x, y) <= 0;
    }
}

export class DefaultObjectComparer<T = any> implements IComparer<T>, IEqualityComparer<T>
{
    public compare(x: T, y: T): number
    {
        if (x.toString() !== {}.toString() && y.toString() !== {}.toString())
        {
            return _stringComparer.compare(x.toString(), y.toString());
        }
        else
        {
            return _stringComparer.compare(Utilities.getHash(x), Utilities.getHash(y));
        }
    }

    public equals(x: T, y: T): boolean
    {
        return Utilities.equals(x, y, true);
    }

    public greaterThan(x: T, y: T): boolean
    {
        return this.compare(x, y) > 0;
    }

    public greaterThanOrEqual(x: T, y: T): boolean
    {
        return this.compare(x, y) >= 0;
    }

    public lessThan(x: T, y: T): boolean
    {
        return this.compare(x, y) < 0;
    }

    public lessThanOrEqual(x: T, y: T): boolean
    {
        return this.compare(x, y) <= 0;
    }
}

const _stringComparer: IComparer<string> = new DefaultStringComparer();
const _numberComparer: IComparer<number> = new DefaultNumberComparer();
const _objectComparer: IComparer<any> = new DefaultObjectComparer();