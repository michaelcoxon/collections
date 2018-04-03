import { IComparer } from "../IComparer";

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
