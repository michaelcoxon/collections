import { Utilities, NotSupportedException, ArgumentUndefinedException } from '@michaelcoxon/utilities';

export interface IComparer<T>
{
    compare(x: T, y: T): number;

    equals(x: T, y: T): boolean;
}

export class DefaultComparer<T> implements IComparer<T>
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
}

export class DefaultStringComparer implements IComparer<string>
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
}

export class DefaultNumberComparer implements IComparer<number>
{
    public compare(x: number, y: number): number
    {
        return x - y;
    }

    public equals(x: number, y: number): boolean
    {
        return x === y;
    }
}

export class DefaultObjectComparer implements IComparer<any>
{
    public compare(x: any, y: any): number
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

    public equals(x: number, y: number): boolean
    {
        return Utilities.equals(x, y, true);
    }
}

export class ReverseComparer<T> implements IComparer<T>
{
    private readonly _comparer: IComparer<T>;

    constructor(comparer: IComparer<T>)
    {
        this._comparer = comparer;
    }

    public compare(x: T, y: T): number
    {
        return this._comparer.compare(y, x);
    }

    public equals(x: T, y: T): boolean
    {
        return this._comparer.equals(y, x);
    }
}

export class CustomComparer<T> implements IComparer<T>
{
    private readonly _comparer?: (a: T, b: T) => number;
    private readonly _equalityComparer?: (x: T, y: T) => boolean;

    constructor(comparer?: (a: T, b: T) => number, equalityComparer?: (x: T, y: T) => boolean)
    {
        this._comparer = comparer;
        this._equalityComparer = equalityComparer;
    }

    public compare(x: T, y: T): number
    {
        if (this._comparer)
        {
            return this._comparer(x, y);
        }
        else
        {
            throw new ArgumentUndefinedException("The comparer");
        }
    }

    public equals(x: T, y: T): boolean
    {
        if (this._equalityComparer)
        {
            return this._equalityComparer(x, y);
        }
        else
        {
            throw new ArgumentUndefinedException("The equality comparer");
        }
    }
}

export class MapComparer<T, M> implements IComparer<T>
{
    private readonly _comparer: IComparer<M>;
    private readonly _selector: (a: T) => M;

    constructor(comparer: IComparer<M>, selector: (a: T) => M)
    {
        this._comparer = comparer;
        this._selector = selector;
    }

    public compare(x: T, y: T): number
    {
        let x_value = this._selector(x);
        let y_value = this._selector(y);

        return this._comparer.compare(x_value, y_value);
    }

    public equals(x: T, y: T): boolean
    {
        let x_value = this._selector(x);
        let y_value = this._selector(y);

        return this._comparer.equals(x_value, y_value);
    }
}

export class CaseInsensitiveStringComparer implements IComparer<string>
{
    public compare(x: string, y: string): number
    {
        let ciX = x.toUpperCase();
        let ciY = y.toUpperCase();

        if (ciX < ciY)
        {
            return -1;
        }

        if (ciX > ciY)
        {
            return 1;
        }

        return 0;
    }

    public equals(x: string, y: string): boolean
    {
        return x === y;
    }
}


const _stringComparer: IComparer<string> = new DefaultStringComparer();
const _numberComparer: IComparer<number> = new DefaultNumberComparer();
const _objectComparer: IComparer<any> = new DefaultObjectComparer();