﻿import CustomComparer from "../src/Comparers/CustomComparer";
import { expect, assert } from 'chai';
import 'mocha';

import { List, Collection } from "../src/Enumerables";



describe("List.constructor", () =>
{
    it("should return a List with the array items in the same order", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new List(array);

        expect(array.length).eq(result.length);

        for (let i = 0; i < result.length; i++)
        {
            expect(array[i]).eq(result.item(i), `index ${i} is not the same`);
        }
    });

    it("should return a List with the List items in the same order", () =>
    {
        const collection = new List([1, 2, 3, 4]);
        const result = new List(collection);

        expect(collection.length).eq(result.length);

        for (let i = 0; i < result.length; i++)
        {
            expect(collection.item(i)).eq(result.item(i), `index ${i} is not the same`);
        }
    });
});

describe("List.add", () =>
{
    it("should return a List with the new item at the end", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const new_item = 5;

        list.add(new_item);

        expect(array.length + 1).eq(list.length);

        for (let i = 0; i < list.length; i++)
        {
            if (i < 4)
            {
                expect(array[i]).eq(list.item(i), `index ${i} is not the same`);
            }
            else
            {
                expect(new_item).eq(list.item(i), `index ${i} is not the same`);
            }
        }
    });
});

describe("List.addRange", () =>
{
    it("should return a List with the new array items at the end", () =>
    {
        const array = [1, 2, 3, 4];
        const new_array = [5, 6, 7, 8];
        const result = new List(array);

        result.addRange(new_array);

        expect(array.length + new_array.length).eq(result.length);

        for (let i = 0; i < result.length; i++)
        {
            if (i < 4)
            {
                expect(array[i]).eq(result.item(i), `index ${i} is not the same`);
            }
            else
            {
                expect(new_array[i - 4]).eq(result.item(i), `index ${i} is not the same`);
            }
        }
    });

    it("should return a List with the new collection items at the end", () =>
    {
        const array = [1, 2, 3, 4];
        const result = new List(array);
        const new_coll = new Collection([5, 6, 7, 8]);

        result.addRange(new_coll);

        expect(array.length + new_coll.length).eq(result.length);

        for (let i = 0; i < result.length; i++)
        {
            if (i < 4)
            {
                expect(array[i]).eq(result.item(i), `index ${i} is not the same`);
            }
            else
            {
                expect(new_coll.item(i - 4)).eq(result.item(i), `index ${i} is not the same`);
            }
        }
    });
});

describe("List.clear", () =>
{
    it("should return a List with the items cleared", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);

        expect(array.length).eq(list.length);

        list.clear();

        expect(0).eq(list.length);
    });
});

describe("List.contains", () =>
{
    it("should return true if the List contains 4", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);

        expect(true).eq(list.contains(4));
    });

    it("should return false if the List does not contain 5", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);

        expect(false).eq(list.contains(5));
    });
});

describe("List.find", () =>
{
    it("should return the item if it is in the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const result = list.find(4);

        expect(4).eq(result);
    });

    it("should return undefined if it is not in the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const result = list.find(5);

        expect(undefined).eq(result);
    });

    it("(isEquivilent) should return the item if it is in the List", () =>
    {
        const array = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
        const list = new List(array);
        const result = list.find({ id: 4 }, true);

        expect({ id: 4 }.id).eq(result!.id);
    });

    it("(isEquivilent) should return undefined if it is not in the List", () =>
    {
        const array = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
        const list = new List(array);
        const result = list.find({ id: 5 }, true);

        expect(undefined).eq(result);
    });
});

describe("List.indexOf", () =>
{
    it("should return the index of the item if it is in the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const result = list.indexOf(4);

        expect(3).eq(result);
    });

    it("should return undefined if it is not in the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const result = list.indexOf(5);

        expect(undefined).eq(result);
    });

    it("(isEquivilent) should return the index of the item if it is in the List", () =>
    {
        const array = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
        const list = new List(array);
        const result = list.indexOf({ id: 4 }, true);

        expect(3).eq(result);
    });

    it("(isEquivilent) should return undefined if it is not in the List", () =>
    {
        const array = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
        const list = new List(array);
        const result = list.indexOf({ id: 5 }, true);

        expect(undefined).eq(result);
    });
});

describe("List.insert", () =>
{
    it("should insert the item into position 0 of the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const expected = [-1, 1, 2, 3, 4];
        const new_item = -1;

        list.insert(new_item, 0);

        expect(array.length + 1).eq(list.length);

        for (let i = 0; i < list.length; i++)
        {
            expect(expected[i]).eq(list.item(i), `index ${i} is not the same`);
        }
    });

    it("should insert the item into position 2 of the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const expected = [1, 2, -1, 3, 4];
        const new_item = -1;

        list.insert(new_item, 2);

        expect(array.length + 1).eq(list.length);

        for (let i = 0; i < list.length; i++)
        {
            expect(expected[i]).eq(list.item(i), `index ${i} is not the same`);
        }

    });

    it("should insert the item into position 3 of the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const expected = [1, 2, 3, -1, 4];
        const new_item = -1;

        list.insert(new_item, 3);

        expect(array.length + 1).eq(list.length);

        for (let i = 0; i < list.length; i++)
        {
            expect(expected[i]).eq(list.item(i), `index ${i} is not the same`);
        }

    });
});

describe("List.prepend", () =>
{
    it("should insert the item into the start of the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const expected = [-1, 1, 2, 3, 4];
        const new_item = -1;

        list.prepend(new_item);

        expect(array.length + 1).eq(list.length);

        for (let i = 0; i < list.length; i++)
        {
            expect(expected[i]).eq(list.item(i), `index ${i} is not the same`);
        }
    });
});

describe("List.prependRange", () =>
{
    it("should insert the array items into the start of the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const new_items = [-2, -1];
        const expected = [-2, -1, 1, 2, 3, 4];

        list.prependRange(new_items);

        expect(array.length + new_items.length).eq(list.length);

        for (let i = 0; i < list.length; i++)
        {
            expect(expected[i]).eq(list.item(i), `index ${i} is not the same`);
        }
    });

    it("should insert the collection items into the start of the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const new_items = new Collection([-2, -1]);
        const expected = [-2, -1, 1, 2, 3, 4];

        list.prependRange(new_items);

        expect(array.length + new_items.length).eq(list.length);

        for (let i = 0; i < list.length; i++)
        {
            expect(expected[i]).eq(list.item(i), `index ${i} is not the same`);
        }
    });
});

describe("List.remove", () =>
{
    it("should remove the item from the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const expected = [1, 3, 4];
        const item = 2;

        list.remove(item);

        expect(array.length - 1).eq(list.length);

        for (let i = 0; i < list.length; i++)
        {
            expect(expected[i]).eq(list.item(i), `index ${i} is not the same`);
        }
    });

    it("should throw an exception when we try to remove an item from the List that is not in the list", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const item = 7;

        try
        {
            list.remove(item);
            assert.fail(undefined, undefined, "No exception was thrown");
        }
        catch (ex)
        {
        }
    });
});

describe("List.removeAt", () =>
{
    it("should Remove the item from position 0 of the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const expected = [2, 3, 4];

        list.removeAt(0);

        expect(array.length - 1).eq(list.length);

        for (let i = 0; i < list.length; i++)
        {
            expect(expected[i]).eq(list.item(i), `index ${i} is not the same`);
        }
    });

    it("should Remove the item from position 2 of the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const expected = [1, 2, 4];

        list.removeAt(2);

        expect(array.length - 1).eq(list.length);

        for (let i = 0; i < list.length; i++)
        {
            expect(expected[i]).eq(list.item(i), `index ${i} is not the same`);
        }

    });

    it("should Remove the item from position 3 of the List", () =>
    {
        const array = [1, 2, 3, 4];
        const list = new List(array);
        const expected = [1, 2, 3];

        list.removeAt(3);

        expect(array.length - 1).eq(list.length);

        for (let i = 0; i < list.length; i++)
        {
            expect(expected[i]).eq(list.item(i), `index ${i} is not the same`);
        }

    });
});

describe("List.sort", () =>
{
    it("should sort the List ascending", () =>
    {
        const array = [4, 2, 3, 1];
        const list = new List(array);
        const expected = [1, 2, 3, 4];

        list.sort();

        for (let i = 0; i < list.length; i++)
        {
            expect(expected[i]).eq(list.item(i), `index ${i} is not the same`);
        }
    });

    it("should sort the List descending", () =>
    {
        const array = [4, 2, 3, 1];
        const list = new List(array);
        const expected = [4, 3, 2, 1];

        list.sort(new CustomComparer<number>((a, b) => b - a));

        for (let i = 0; i < list.length; i++)
        {
            expect(expected[i]).eq(list.item(i), `index ${i} is not the same`);
        }

    });
});