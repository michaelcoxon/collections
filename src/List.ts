import { Utilities, InvalidTypeException, ArgumentException } from '@michaelcoxon/utilities';
import { IList } from './Interfaces/IList';
import { ICollection } from './Interfaces/ICollection';
import { IEnumerable } from './Interfaces/IEnumerable';
import { Collection } from './Collection';
import { IEnumerableOrArray } from './Types';
import { enumerableOrArrayToArray } from './Utilities';
import { IComparer } from './Interfaces/IComparer';
import { DefaultComparer } from './Comparers/DefaultComparer';


export class List<T> extends Collection<T> implements IList<T>, ICollection<T>, IEnumerable<T>
{
    public addRange(array: T[]): void;
    public addRange(enumerable: IEnumerable<T>): void;
    public addRange(enumerableOrArray: IEnumerableOrArray<T>): void
    {
        let array = enumerableOrArrayToArray(enumerableOrArray);
        this._baseArray = this._baseArray.concat(array);
    }

    public find(obj: T, isEquivilent: boolean = false): T | undefined
    {
        if (isEquivilent)
        {
            for (let item of this._baseArray)
            {
                var found = false;

                if (isEquivilent)
                {
                    found = Utilities.equals(item, obj);
                }
                if (found)
                {
                    return item;
                }
            }
        }
        else
        {
            let index = this.indexOf(obj);
            if (index !== undefined)
            {
                return this.item(index);
            }
            else
            {
                return undefined;
            }
        }
    }

    public indexOf(obj: T, isEquivilent: boolean = false): number | undefined
    {
        if (isEquivilent)
        {
            let index: number | undefined = undefined;

            this.forEach((item, i) =>
            {
                let found = false;

                if (isEquivilent)
                {
                    found = Utilities.equals(item, obj);
                }
                else
                {
                    found = item == obj;
                }
                if (found)
                {
                    index = i;
                    return false;
                }
            });

            return index;
        }
        else
        {
            let index = this._baseArray.indexOf(obj);
            if (index == -1)
            {
                return undefined;
            }
            return index;
        }
    }

    public insert(obj: T, index: number): void
    {
        this._baseArray.splice(index, 0, obj);
    }

    public prepend(obj: T): void
    {
        this.insert(obj, 0);
    }

    public prependRange(array: T[]): void;
    public prependRange(enumerable: Collection<T>): void;
    public prependRange(enumerableOrArray: IEnumerableOrArray<T>): void
    {
        let array = enumerableOrArrayToArray(enumerableOrArray);
        this._baseArray.splice(0, 0, ...array);
    }

    public removeAt(index: number): void
    {
        this._baseArray.splice(index, 1);
    }

    public sort(comparer: IComparer<T> = new DefaultComparer<T>()): void
    {
        this._baseArray.sort((a, b) => comparer.compare(a, b));
    }
}
