import Utilities from '@michaelcoxon/utilities/lib/Utilities';
import { IComparer } from "../Interfaces/IComparer";
import { IEqualityComparer } from '../Interfaces/IEqualityComparer';

class DefaultComparer<T> implements IComparer<T>, IEqualityComparer<T>
{
    public compare(x: T, y: T): number
    {
        if (typeof x == 'string' && typeof y == 'string')
        {
            return DefaultComparers.StringComparer.compare(x, y);
        }
        else if (typeof x == 'number' && typeof y == 'number')
        {
            return DefaultComparers.NumberComparer.compare(x, y);
        }
        else
        {
            return DefaultComparers.ObjectComparer.compare(x, y);
        }
    }

    public equals(x: T, y: T): boolean
    {
        if (typeof x == 'string' && typeof y == 'string')
        {
            return DefaultComparers.StringComparer.equals(x, y);
        }
        else if (typeof x == 'number' && typeof y == 'number')
        {
            return DefaultComparers.NumberComparer.equals(x, y);
        }
        else
        {
            return DefaultComparers.ObjectComparer.equals(x, y);
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

class DefaultStringComparer implements IComparer<string>, IEqualityComparer<string>
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

class DefaultNumberComparer implements IComparer<number>, IEqualityComparer<number>
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

class DefaultObjectComparer<T extends any = any> implements IComparer<T>, IEqualityComparer<T>
{
    public compare(x: T, y: T): number
    {
        const toStringMethodName = 'toString';
        const x_toString = x[toStringMethodName]?.call(x);
        const y_toString = y[toStringMethodName]?.call(y);

        if (x_toString !== undefined          // if there is no toString(), lets serialize it with a hash
            && x_toString !== {}.toString()   // if it is an object type, lets serialize it with a hash
            && y_toString !== undefined       // if there is no toString(), lets serialize it with a hash
            && y_toString !== {}.toString())  // if it is an object type, lets serialize it with a hash
        {
            return DefaultComparers.StringComparer.compare(x_toString, y_toString);
        }
        else
        {
            return DefaultComparers.StringComparer.compare(Utilities.getHash(x), Utilities.getHash(y));
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

interface Defaults
{
    DefaultComparer: IComparer<any>
    StringComparer: IComparer<string>;
    NumberComparer: IComparer<number>;
    ObjectComparer: IComparer<any>;

}

export const DefaultComparers: Defaults = {
    DefaultComparer: new DefaultComparer<any>(),
    StringComparer: new DefaultStringComparer(),
    NumberComparer: new DefaultNumberComparer(),
    ObjectComparer: new DefaultObjectComparer(),
};