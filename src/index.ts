/*!
 * collections v1.0.0
 * ------------------------
 * Collections for JS and TypeScript
 * © 2017 Michael Coxon
 * https://github.com/michaelcoxon/collections#readme
 */

import { Collection as CollectionClass } from './Collection';
import { Enumerator as EnumeratorClass } from './Enumerator';
import { List as ListClass } from './List';
import { Queryable as QueryableClass } from './Queryable';


export namespace Collections
{
    export var Collection = CollectionClass;
    export var Enumerator = EnumeratorClass;
    export var List = ListClass;
    export var Queryable = QueryableClass;
}