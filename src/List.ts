import { Utilities, InvalidTypeException, ArgumentException } from '@michaelcoxon/utilities';
import { IList } from './IList';
import { ICollection } from './ICollection';
import { IEnumerable } from './IEnumerable';
import { Collection } from './Collection';


export class List<T> extends Collection<T> implements IList<T>, ICollection<T>, IEnumerable<T>
{
    public addRange(array: T[]): void;
    public addRange(collection: ICollection<T>): void;
    public addRange(collectionOrArray: IEnumerableOrArray<T>): void
    {
        let array = Collection.collectionOrArrayToArray(collectionOrArray);

        // make sure we have items
        if (array.length > 0)
        {
            this._baseArray = this._baseArray.concat(array);
        }
        else
        {
            throw new ArgumentException('collectionOrArray', "No elements in collectionOrArray");
        }
    }

    public clear(): void
    {
        this._baseArray.length = 0;
    }

    public contains(obj: T, isEquivilent?: boolean): boolean
    {
        let ret = false;

        if (this.find(obj, isEquivilent || false) != undefined)
        {
            ret = true;
        }

        return ret;
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
            let index = this.findIndex(obj);
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

    public findIndex(obj: T, isEquivilent: boolean = false): number | undefined
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

    public insertAt(obj: T, index: number): void
    {
        this._baseArray.splice(index, 0, obj);
    }

    public prepend(obj: T): void
    {
        this.insertAt(obj, 0);
    }

    public prependRange(array: T[]): void;
    public prependRange(collection: Collection<T>): void;
    public prependRange(collectionOrArray: EnumerableOrArray<T>): void
    {
        let array = Collection.collectionOrArrayToArray(collectionOrArray);

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
