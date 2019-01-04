import { IComparer } from "../Interfaces/IComparer";
import { IEqualityComparer } from '../Interfaces/IEqualityComparer';

export class CaseInsensitiveStringComparer implements IComparer<string>, IEqualityComparer<string>
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
