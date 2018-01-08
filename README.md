# collections
Collections for JS and TypeScript

Check out the tests for a more comprehesive doco.

### Note for TypeScript
If you are using TypeScript, the classes herein are generics. This means
you *should* construct them with a type parameter to use them.

For example:
```js
let myArray = [1, 2, 3, 4];
let myCollection = new Collection<number>(myArray);
```

If the type can be determined by the compiler (as in the example above) it
is not neccessary to explicitly define the type - it will just make the code
more readable.

All examples given in the documentation are JavaScript examples so that no-one 
gets confused.

Just use this as you need to - sometimes it wont be neccessary - the examples
below will still work fine.


# Collection
This is the base class for `List` and `Queryable`. 

A collection is immutable meaning you cannot modify it once it is created. 
It only provides ways of iterating items and copying items to a new collection

## Constructors
You can create a new Collection from either a current 
Collection, an array or nothing.

### Default constructor
```js
let myCollection = new Collection();
```

### Array constructor
```js
let myArray = [1, 2, 3, 4];
let myCollection = new Collection(myArray);
```

### Collection constructor
```js
let myArray = [1, 2, 3, 4];
let myCollection = new Collection(myArray);
let myCollection2 = new Collection(myCollection);
```

## Properties
### count: number
> Returns to number of items in the Collection.

This will return a number greater than or equal to 0.

`myCollection.count;`

## Methods
### copyTo(into: Collection): void
> Copies the items from the current collection into another one.

This appends the items from one collection into another.

```js
let myCollection = new Collection([1, 2, 3, 4]);
let myCollection2 = new Collection([-1, 0]);

// copy the items from myCollection into myCollection2
myCollection.copyTo(myCollection2);

// the contents of myCollection2 will now be: [-1, 0, 1, 2, 3, 4]
```

### forEach(callback: (value: any, index: number) => boolean | void): void
> Iterates over each item in the collection, performing the callback on 
> each item.

Return `false` from your callback to break iteration. You do not have to
return anything if you do not want to break. You can return `true` to
continue iteration if required.

```js
let myCollection = new Collection([1, 2, 3, 4]);
let count = 0;

// iterate over each item, if the item is '3' then break.
myCollection.forEach((value, index) =>
{
    if (value === 3)
    {
        return false;
    }
    count++;
});

// count will be equal to 2
```

### item(index: number): any
> Returns the item at the index or throws an exception if the index is 
> out of bounds of the Collection.

`myCollection.item(6);`

### toArray(): []
> Returns the contents of the collection as an array.

`myCollection.toArray();`

## Extension methods
These methods will only work if you have included the module that they are in.
The module is the first part and the method is the second part in the docs 
below using the pattern `{module}::{method}`

### Enumerator::getEnumerator(): Enumerator
> Returns an Enumerator for a collection.

```js
let myCollection = new Collection([1, 2, 3, 4]);
let myCollectionEnumerator = myCollection.getEnumerator();
```


# Enumerator
The enumerator class allows iteration of a collection or array.

An enumerator allows you to move incrementally through a collection or array
giving you the ability to `peek` at the next element or move to it.

## Constructors
You can create a new Enumerator from either a current 
Collection or an array. 

### Array constructor
```js
let myArray = [1, 2, 3, 4];
let myEnumerator = new Enumerator(myArray);
```

### Collection constructor
```js
let myArray = [1, 2, 3, 4];
let myCollection = new Collection(myArray);
let myEnumerator = new Enumerator(myCollection);
```

## Properties
### current: any
> Returns the current item in the enumeration.

This will throw an error if `moveNext()` is not called **before** it.

This will throw an error if the pointer is invalid (out of bounds).

`myEnumerator.current;`

## Methods
### moveNext(): boolean
> Increments the internal pointer of the Enumerator, essentially 
> moving to the next element in the Enumerator. 
> 
> Returns a boolean value of whether there is another item in the 
> enumerator after this item.

Returns `false` if there are no more elements in the enumerator.

```js
let myCollection = new Collection([1, 2, 3, 4]);
let myEnumerator = new Enumerator(myCollection);

// iterate over each item, will break when there 
// are no more items left.
while (myEnumerator.moveNext())
{
  // do something here...
}
```

### peek(): any
> Returns the next item in the enumerator without incrementing the internal
> pointer.

Will throw an exception if there is no item to "peek" at.

```js
let myCollection = new Collection([1, 2, 3, 4]);
let myEnumerator = new Enumerator(myCollection);

// check out the first item, it will return 1
let thisIsTheFirstElement = myEnumerator.peek();

// we can still iterate over the collection
while (myEnumerator.moveNext())
{
  // do something here...
}
```

### reset(): void
> Moves the pointer back to the start of the enumerator as thought it were
> freshly created

You must call `moveNext()` after calling this as it resets the entire
iteration.

```js
let myCollection = new Collection([1, 2, 3, 4]);
let myEnumerator = new Enumerator(myCollection);

// iterate over the collection
while (myEnumerator.moveNext())
{
  // do something here...
}

// reset the iteration
myEnumerator.reset();

// iterate over the collection again
while (myEnumerator.moveNext())
{
  // do something else here...
}
```

# List
A list is a level above a collection. It allows you to add, remove, insert and
prepend items. Think of it as a mutable collection.

It inherits from Collection.

## Constructors
You can create a new List from either a current 
Collection, an array or nothing.

### Default constructor
```js
let myList = new List();
```

### Array constructor
```js
let myArray = [1, 2, 3, 4];
let myList = new List(myArray);
```

### Collection constructor
```js
let myArray = [1, 2, 3, 4];
let myCollection = new Collection(myArray);
let myList = new List(myCollection);
```

## Properties
Inherits all properties from Collection.

## Methods
Inherits all methods from Collection.

### add(obj: any): void
### addRange(array: []): void
### addRange(collection: Collection): void
### clear(): void
### contains(obj: any, isEquivilent?: boolean): boolean
### find(obj: any, isEquivilent: boolean = false): any | undefined
### findIndex(obj: any, isEquivilent: boolean = false): number | undefined
### insertAt(obj: any, index: number): void
### prepend(obj: any): void
### prependRange(array: []): void
### prependRange(collection: Collection): void
### remove(obj: any): void
### removeAt(index: number): void
### sort(comparer?: IComparer): void


# Queryable
The Queryable class is mostly fluent by design and allows chaining of 
*query-like* methods to filter or aggregate an array or collection.

It has been modelled off of the .NET Fluent LINQ extension methods.

It inherits from Collection.

## Predicate type
A Predicate is a delegate method that takes an item of the queryable as
the argument, and returns a boolean value.

This is used on the `all`, `any` and `where` methods of Queryable.

`Predicate = (item: any) => boolean`

## Constructors
You can create a new Queryable from either a current 
Collection, an array or nothing.

### Default constructor
```js
let myList = new List();
```

### Array constructor
```js
let myArray = [1, 2, 3, 4];
let myQueryable = new Queryable(myArray);
```

### Collection constructor
```js
let myArray = [1, 2, 3, 4];
let myCollection = new Collection(myArray);
let myQueryable = new Queryable(myCollection);
```

## Properties
Inherits all properties from Collection.

## Methods
Inherits all methods from Collection.

### all(predicate: Predicate): boolean
### any(): boolean
> Returns `true` if the Queryable contains elements

```js
if(myQueryable.any())
{
  // do something because the queryable has elements
}
```
### any(predicate: Predicate): boolean
> Returns `true` if any of the elements satisfy the predicate.

```js
let myQueryable = new Queryable([1, 2, 3, 4]);
if(myQueryable.any((i) => i == 2))
{
  // the queryable contains a '2'
}
```
### average(propertyName: string): number
### average(selector: (a: any) => number)
### clone(): Queryable
### distinct(propertyName: string): Queryable
### distinct(selector: (a: any) => any): Queryable
### first(): any
### firstOrDefault(): any | null
### groupBy(propertyName: string): Queryable
### groupBy(keySelector: (a: any) => any): Queryable
### max(propertyName: string): number
### max(selector: (a: any) => number): number
### min(propertyName: string): number
### min(selector: (a: any) => number): number
### ofType(ctor: Constructor): Queryable
### orderBy(propertyName: K, comparer?: IComparer): Queryable
### orderBy(selector: (a: T) => R, comparer?: IComparer): Queryable
### orderByDescending(propertyName: K, comparer?: IComparer): Queryable
### orderByDescending(selector: (a: any) => any, comparer?: IComparer): Queryable
### skip(count: number): Queryable
### select(propertyName: string): Queryable
### select(selector: (a: any) => any): Queryable
### sum(propertyName: string): number
### sum(selector: (a: any) => number): number
### take(count: number): Queryable
### where(predicate: Predicate): Queryable


