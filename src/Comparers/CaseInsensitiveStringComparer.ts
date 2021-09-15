import { IComparer } from "../Interfaces/IComparer";
import { IEqualityComparer } from "../Interfaces/IEqualityComparer";

export default class CaseInsensitiveStringComparer implements IComparer<string>, IEqualityComparer<string>
{
    public compare(x: string, y: string): number
    {
        return x.localeCompare(y, undefined, { sensitivity: 'accent' });
    }

    public equals(x: string, y: string): boolean
    {
        return this.compare(x, y) === 0;
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
