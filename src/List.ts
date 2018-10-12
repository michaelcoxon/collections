import { Utilities, InvalidTypeException, ArgumentException } from '@michaelcoxon/utilities';
import { Collection, CollectionOrArray } from './Collection';
import { IComparer, DefaultComparer } from './Comparer';


export class List<T> extends Collection<T>
{
    public add(obj: T): void
    {
        this._baseArray.push(obj);
    }

    public addRange(array: T[]): void;
    public addRange(collection: Collection<T>): void;
    public addRange(collectionOrArray: CollectionOrArray<T>): void
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
    public prependRange(collectionOrArray: CollectionOrArray<T>): void
    {
        let array = Collection.collectionOrArrayToArray(collectionOrArray);

        this._baseArray.splice(0, 0, ...array);
    }

    public remove(obj: T): void
    {
        let index = this.findIndex(obj);

        if (index != undefined)
        {
            this.removeAt(index);
        }
        else
        {
            throw new Error("Not in array");
        }
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
