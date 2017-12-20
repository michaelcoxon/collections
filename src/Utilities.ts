import { ArgumentException } from './Exceptions';

export namespace Utilities
{
    // returns true if the two objects are equal but not the same object. (compares public keys)
    export function equals<T>(obj1: T, obj2: T, forceJSON?: boolean): boolean
    {
        var state = false;

        forceJSON = forceJSON || false;

        if (!forceJSON)
        {
            for (let key in obj1)
            {
                if (obj1.hasOwnProperty(key))
                {
                    state = obj1[key] == obj2[key];

                    if (!state)
                    {
                        break;
                    }
                }
            }
        }
        else
        {
            state = equivilentToByJSON(obj1, obj2);
        }

        return state;
    }

    // returns true if the two objects are equal but not the same object. (compares the JSON equilient of each object) .. should be faster.. should..
    export function equivilentToByJSON<T>(obj1: T, obj2: T): boolean
    {
        return JSON.stringify(obj1) == JSON.stringify(obj2);
    }

    // returns a hash of the object
    export function getHash(o: any): string
    {
        let hash: string = "";

        if (!!JSON && !!JSON.stringify)
        {
            for (let key in o)
            {
                if (o.hasOwnProperty(key))
                {
                    hash += key + ":" + o[key];
                }
            }
        }
        else
        {
            hash = JSON.stringify(o);
        }

        return hash;
    }

    // Returns the type of the object as a string
    export function getType(o: any)
    {
        // null
        if (o === null)
        {
            return 'null';
        }

        // jquery
        if (o.fn !== undefined && o.fn.jquery !== undefined)
        {
            return 'jQuery';
        }

        // value types
        if (typeof (o) != 'object')
        {
            return typeof (o);
        }

        // MicrosoftAjax
        if (o.constructor.getName && o.constructor.getName() != null)
        {
            return o.constructor.getName();
        }

        // constructor method name
        if (o.constructor.name === undefined)
        {
            var name = o.constructor.toString().match(/^[\n\r\s]*function\s*([^\s(]+)/)[1]
            if (name != "")
            {
                return name;
            }
        }
        else
        {
            if (o.constructor.name != "") return o.constructor.name;
        }

        // fallback
        return typeof o;
    }
}