"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Collection_1 = require("../src/Collection");
var List_1 = require("../src/List");
var chai_1 = require("chai");
require("mocha");
var Comparer_1 = require("../src/Comparer");
describe("Create a List", function () {
    it("should return a List with the array items in the same order", function () {
        var array = [1, 2, 3, 4];
        var result = new List_1.List(array);
        chai_1.expect(array.length).eq(result.count);
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(array[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
    it("should return a List with the List items in the same order", function () {
        var collection = new List_1.List([1, 2, 3, 4]);
        var result = new List_1.List(collection);
        chai_1.expect(collection.count).eq(result.count);
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(collection.item(i)).eq(result.item(i), "index " + i + " is not the same");
        }
    });
});
describe("Add an item to a List", function () {
    it("should return a List with the new item at the end", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var new_item = 5;
        list.add(new_item);
        chai_1.expect(array.length + 1).eq(list.count);
        for (var i = 0; i < list.count; i++) {
            if (i < 4) {
                chai_1.expect(array[i]).eq(list.item(i), "index " + i + " is not the same");
            }
            else {
                chai_1.expect(new_item).eq(list.item(i), "index " + i + " is not the same");
            }
        }
    });
});
describe("Add items to a List", function () {
    it("should return a List with the new array items at the end", function () {
        var array = [1, 2, 3, 4];
        var new_array = [5, 6, 7, 8];
        var result = new List_1.List(array);
        result.addRange(new_array);
        chai_1.expect(array.length + new_array.length).eq(result.count);
        for (var i = 0; i < result.count; i++) {
            if (i < 4) {
                chai_1.expect(array[i]).eq(result.item(i), "index " + i + " is not the same");
            }
            else {
                chai_1.expect(new_array[i - 4]).eq(result.item(i), "index " + i + " is not the same");
            }
        }
    });
    it("should return a List with the new collection items at the end", function () {
        var array = [1, 2, 3, 4];
        var result = new List_1.List(array);
        var new_coll = new Collection_1.Collection([5, 6, 7, 8]);
        result.addRange(new_coll);
        chai_1.expect(array.length + new_coll.count).eq(result.count);
        for (var i = 0; i < result.count; i++) {
            if (i < 4) {
                chai_1.expect(array[i]).eq(result.item(i), "index " + i + " is not the same");
            }
            else {
                chai_1.expect(new_coll.item(i - 4)).eq(result.item(i), "index " + i + " is not the same");
            }
        }
    });
});
describe("Clear a List", function () {
    it("should return a List with the items cleared", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        chai_1.expect(array.length).eq(list.count);
        list.clear();
        chai_1.expect(0).eq(list.count);
    });
});
describe("Determin if a List contains an item", function () {
    it("should return true if the List contains 4", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        chai_1.expect(true).eq(list.contains(4));
    });
    it("should return false if the List does not contain 5", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        chai_1.expect(false).eq(list.contains(5));
    });
});
describe("Find an item in the list", function () {
    it("should return the item if it is in the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var result = list.find(4);
        chai_1.expect(4).eq(result);
    });
    it("should return undefined if it is not in the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var result = list.find(5);
        chai_1.expect(undefined).eq(result);
    });
});
describe("Find an item's index in the list", function () {
    it("should return the index of the item if it is in the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var result = list.findIndex(4);
        chai_1.expect(3).eq(result);
    });
    it("should return undefined if it is not in the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var result = list.findIndex(5);
        chai_1.expect(undefined).eq(result);
    });
});
describe("Insert an item into the list", function () {
    it("should insert the item into position 0 of the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var expected = [-1, 1, 2, 3, 4];
        var new_item = -1;
        list.insertAt(new_item, 0);
        chai_1.expect(array.length + 1).eq(list.count);
        for (var i = 0; i < list.count; i++) {
            chai_1.expect(expected[i]).eq(list.item(i), "index " + i + " is not the same");
        }
    });
    it("should insert the item into position 2 of the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var expected = [1, 2, -1, 3, 4];
        var new_item = -1;
        list.insertAt(new_item, 2);
        chai_1.expect(array.length + 1).eq(list.count);
        for (var i = 0; i < list.count; i++) {
            chai_1.expect(expected[i]).eq(list.item(i), "index " + i + " is not the same");
        }
    });
    it("should insert the item into position 3 of the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var expected = [1, 2, 3, -1, 4];
        var new_item = -1;
        list.insertAt(new_item, 3);
        chai_1.expect(array.length + 1).eq(list.count);
        for (var i = 0; i < list.count; i++) {
            chai_1.expect(expected[i]).eq(list.item(i), "index " + i + " is not the same");
        }
    });
});
describe("Prepend an item into the list", function () {
    it("should insert the item into the start of the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var expected = [-1, 1, 2, 3, 4];
        var new_item = -1;
        list.prepend(new_item);
        chai_1.expect(array.length + 1).eq(list.count);
        for (var i = 0; i < list.count; i++) {
            chai_1.expect(expected[i]).eq(list.item(i), "index " + i + " is not the same");
        }
    });
});
describe("Prepend items into the list", function () {
    it("should insert the array items into the start of the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var new_items = [-2, -1];
        var expected = [-2, -1, 1, 2, 3, 4];
        list.prependRange(new_items);
        chai_1.expect(array.length + new_items.length).eq(list.count);
        for (var i = 0; i < list.count; i++) {
            chai_1.expect(expected[i]).eq(list.item(i), "index " + i + " is not the same");
        }
    });
    it("should insert the collection items into the start of the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var new_items = new Collection_1.Collection([-2, -1]);
        var expected = [-2, -1, 1, 2, 3, 4];
        list.prependRange(new_items);
        chai_1.expect(array.length + new_items.count).eq(list.count);
        for (var i = 0; i < list.count; i++) {
            chai_1.expect(expected[i]).eq(list.item(i), "index " + i + " is not the same");
        }
    });
});
describe("Remove an item from the list", function () {
    it("should remove the item from the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var expected = [1, 3, 4];
        var item = 2;
        list.remove(item);
        chai_1.expect(array.length - 1).eq(list.count);
        for (var i = 0; i < list.count; i++) {
            chai_1.expect(expected[i]).eq(list.item(i), "index " + i + " is not the same");
        }
    });
    it("should throw an exception when we try to remove an item from the List that is not in the list", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var item = 7;
        try {
            list.remove(item);
            chai_1.assert.fail(undefined, undefined, "No exception was thrown");
        }
        catch (ex) {
        }
    });
});
describe("Remove an item into the list at the specified index", function () {
    it("should Remove the item from position 0 of the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var expected = [2, 3, 4];
        list.removeAt(0);
        chai_1.expect(array.length - 1).eq(list.count);
        for (var i = 0; i < list.count; i++) {
            chai_1.expect(expected[i]).eq(list.item(i), "index " + i + " is not the same");
        }
    });
    it("should Remove the item from position 2 of the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var expected = [1, 2, 4];
        list.removeAt(2);
        chai_1.expect(array.length - 1).eq(list.count);
        for (var i = 0; i < list.count; i++) {
            chai_1.expect(expected[i]).eq(list.item(i), "index " + i + " is not the same");
        }
    });
    it("should Remove the item from position 3 of the List", function () {
        var array = [1, 2, 3, 4];
        var list = new List_1.List(array);
        var expected = [1, 2, 3];
        list.removeAt(3);
        chai_1.expect(array.length - 1).eq(list.count);
        for (var i = 0; i < list.count; i++) {
            chai_1.expect(expected[i]).eq(list.item(i), "index " + i + " is not the same");
        }
    });
});
describe("Sort the List", function () {
    it("should sort the List ascending", function () {
        var array = [4, 2, 3, 1];
        var list = new List_1.List(array);
        var expected = [1, 2, 3, 4];
        list.sort();
        for (var i = 0; i < list.count; i++) {
            chai_1.expect(expected[i]).eq(list.item(i), "index " + i + " is not the same");
        }
    });
    it("should sort the List descending", function () {
        var array = [4, 2, 3, 1];
        var list = new List_1.List(array);
        var expected = [4, 3, 2, 1];
        list.sort(new Comparer_1.CustomComparer(function (a, b) { return b - a; }));
        for (var i = 0; i < list.count; i++) {
            chai_1.expect(expected[i]).eq(list.item(i), "index " + i + " is not the same");
        }
    });
});
//# sourceMappingURL=List.spec.js.map