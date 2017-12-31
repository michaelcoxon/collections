"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Collection_1 = require("../src/Collection");
var chai_1 = require("chai");
require("mocha");
describe("Create a collection", function () {
    it("should return a collection with the array items in the same order", function () {
        var array = [1, 2, 3, 4];
        var result = new Collection_1.Collection(array);
        chai_1.expect(array.length).eq(result.count);
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(array[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
    it("should return a collection with the collection items in the same order", function () {
        var collection = new Collection_1.Collection([1, 2, 3, 4]);
        var result = new Collection_1.Collection(collection);
        chai_1.expect(collection.count).eq(result.count);
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(collection.item(i)).eq(result.item(i), "index " + i + " is not the same");
        }
    });
});
describe("Clone a collection", function () {
    it("should return a collection with the same items and is not the same collection", function () {
        var coll1 = new Collection_1.Collection([1, 2, 3, 4]);
        var coll2 = coll1.clone();
        chai_1.expect(coll2.count).eq(coll1.count);
        chai_1.expect(coll2).to.not.eq(coll1);
        for (var i = 0; i < coll2.count; i++) {
            chai_1.expect(coll2.item(i)).eq(coll1.item(i), "index " + i + " is not the same");
        }
    });
});
describe("Copy a collection", function () {
    it("should return a collection the items appended to another collection", function () {
        var coll1 = new Collection_1.Collection([1, 2, 3, 4]);
        var coll2 = new Collection_1.Collection([-4, -3, -2, -1, 0]);
        var expected = new Collection_1.Collection([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
        coll1.copyTo(coll2);
        for (var i = 0; i < coll2.count; i++) {
            chai_1.expect(expected.item(i)).eq(coll2.item(i), "index " + i + " is not the same. got " + expected.item(i) + " != " + coll2.item(i));
        }
    });
});
describe("Iterate over a collection", function () {
    it("should iterate over all items in a collection", function () {
        var array = [1, 2, 3, 4];
        var coll1 = new Collection_1.Collection(array);
        var count = 0;
        coll1.forEach(function (value, index) {
            chai_1.expect(array[index]).to.eq(value);
            chai_1.expect(coll1.item(index)).to.eq(value);
            count++;
        });
        chai_1.expect(array.length).to.eq(count);
    });
    it("should iterate over items in a collection and break on return false", function () {
        var array = [1, 2, 3, 4];
        var coll1 = new Collection_1.Collection(array);
        var count = 0;
        coll1.forEach(function (value, index) {
            if (value === 3) {
                return false;
            }
            count++;
        });
        chai_1.expect(2).to.eq(count);
    });
});
//# sourceMappingURL=Collection.spec.js.map