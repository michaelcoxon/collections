import { IComparer } from "../Interfaces/IComparer";
import { Utilities } from "@michaelcoxon/utilities";

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

const _stringComparer: IComparer<string> = new DefaultStringComparer();
const _numberComparer: IComparer<number> = new DefaultNumberComparer();
const _objectComparer: IComparer<any> = new DefaultObjectComparer();