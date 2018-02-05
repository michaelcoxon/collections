"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Queryable_1 = require("../src/Queryable");
var chai_1 = require("chai");
require("mocha");
describe("Create a Queryable", function () {
    it("should return a Queryable with the array items in the same order", function () {
        var array = [1, 2, 3, 4];
        var result = new Queryable_1.Queryable(array);
        chai_1.expect(array.length).eq(result.count);
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(array[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
    it("should return a Queryable with the List items in the same order", function () {
        var collection = new Queryable_1.Queryable([1, 2, 3, 4]);
        var result = new Queryable_1.Queryable(collection);
        chai_1.expect(collection.count).eq(result.count);
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(collection.item(i)).eq(result.item(i), "index " + i + " is not the same");
        }
    });
});
describe("All", function () {
    it("should return true if all items match the predicate", function () {
        var array = [1, 2, 3, 4];
        var result = new Queryable_1.Queryable(array);
        chai_1.expect(true).to.eq(result.all(function (i) { return i > 0; }));
    });
    it("should return false if one item doesnt match the predicate", function () {
        var array = [1, 2, 3, 4];
        var result = new Queryable_1.Queryable(array);
        chai_1.expect(false).to.eq(result.all(function (i) { return i > 1; }));
    });
});
describe("Any", function () {
    it("should return true if the queryable has items", function () {
        var array = [1, 2, 3, 4];
        var result = new Queryable_1.Queryable(array);
        chai_1.expect(true).to.eq(result.any());
    });
    it("should return false if the queryable is empty", function () {
        var array = [];
        var result = new Queryable_1.Queryable(array);
        chai_1.expect(false).to.eq(result.any());
    });
    it("should return true if any of the items match the predicate", function () {
        var array = [1, 2, 3, 4];
        var result = new Queryable_1.Queryable(array);
        chai_1.expect(true).to.eq(result.any(function (i) { return i == 2; }));
    });
    it("should return false if none of the items match the predicate", function () {
        var array = [1, 2, 3, 4];
        var result = new Queryable_1.Queryable(array);
        chai_1.expect(false).to.eq(result.any(function (i) { return i == -1; }));
    });
});
describe("Average", function () {
    it("should return the average of the numbers", function () {
        var array = [1, 2, 3, 4];
        var query = new Queryable_1.Queryable(array);
        var result = query.average(function (i) { return i; });
        chai_1.expect(2.5).to.eq(result);
    });
});
describe("Distinct", function () {
    it("should return only unique items in the collection", function () {
        var array = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4];
        var query = new Queryable_1.Queryable(array);
        var expected = [1, 2, 3, 4];
        chai_1.expect(array.length).eq(query.count);
        var result = query.distinct(function (n) { return n; });
        chai_1.expect(expected.length).eq(result.count);
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(expected[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
});
describe("First", function () {
    it("should return the first item in the Queryable", function () {
        var array = [1, 2, 3, 4];
        var result = new Queryable_1.Queryable(array);
        chai_1.expect(1).to.eq(result.first());
    });
    it("should throw an exception if the Queryable is empty", function () {
        var array = [];
        var result = new Queryable_1.Queryable(array);
        try {
            result.first();
            chai_1.assert.fail(undefined, undefined, "For some reason the Queryable is not empty");
        }
        catch (ex) { }
    });
});
describe("FirstOrDefault", function () {
    it("should return the first item in the Queryable", function () {
        var array = [1, 2, 3, 4];
        var result = new Queryable_1.Queryable(array);
        chai_1.expect(1).to.eq(result.firstOrDefault());
    });
    it("should return null if the Queryable is empty", function () {
        var array = [];
        var result = new Queryable_1.Queryable(array);
        chai_1.expect(null).to.eq(result.firstOrDefault());
    });
});
describe("Last", function () {
    it("should return the last item in the Queryable", function () {
        var array = [1, 2, 3, 4];
        var result = new Queryable_1.Queryable(array);
        chai_1.expect(4).to.eq(result.last());
    });
    it("should throw an exception if the Queryable is empty", function () {
        var array = [];
        var result = new Queryable_1.Queryable(array);
        try {
            result.last();
            chai_1.assert.fail(undefined, undefined, "For some reason the Queryable is not empty");
        }
        catch (ex) { }
    });
});
describe("LastOrDefault", function () {
    it("should return the last item in the Queryable", function () {
        var array = [1, 2, 3, 4];
        var result = new Queryable_1.Queryable(array);
        chai_1.expect(4).to.eq(result.lastOrDefault());
    });
    it("should return null if the Queryable is empty", function () {
        var array = [];
        var result = new Queryable_1.Queryable(array);
        chai_1.expect(null).to.eq(result.lastOrDefault());
    });
});
describe("Max", function () {
    it("should return the max of the numbers", function () {
        var array = [1, 2, 3, 4];
        var query = new Queryable_1.Queryable(array);
        var result = query.max(function (i) { return i; });
        chai_1.expect(4).to.eq(result);
    });
});
describe("Min", function () {
    it("should return the min of the numbers", function () {
        var array = [1, 2, 3, 4];
        var query = new Queryable_1.Queryable(array);
        var result = query.min(function (i) { return i; });
        chai_1.expect(1).to.eq(result);
    });
});
describe("OfType", function () {
    var BaseClass = (function () {
        function BaseClass() {
        }
        Object.defineProperty(BaseClass.prototype, "property", {
            get: function () { return "base value"; },
            enumerable: true,
            configurable: true
        });
        return BaseClass;
    }());
    var DerivedClass = (function (_super) {
        __extends(DerivedClass, _super);
        function DerivedClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(DerivedClass.prototype, "property", {
            get: function () { return "derived value"; },
            enumerable: true,
            configurable: true
        });
        return DerivedClass;
    }(BaseClass));
    var DerivedClass2 = (function (_super) {
        __extends(DerivedClass2, _super);
        function DerivedClass2() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(DerivedClass2.prototype, "property", {
            get: function () { return "derived 2 value"; },
            enumerable: true,
            configurable: true
        });
        return DerivedClass2;
    }(DerivedClass));
    it("should return the items that match the type", function () {
        var array = [
            new BaseClass(),
            new DerivedClass(),
            new BaseClass(),
            new DerivedClass2(),
            new DerivedClass()
        ];
        var query = new Queryable_1.Queryable(array);
        var result = query.ofType(DerivedClass);
        chai_1.expect(3).to.eq(result.count);
        chai_1.expect("derived value").to.eq(result.item(0).property);
        chai_1.expect("derived 2 value").to.eq(result.item(1).property);
        chai_1.expect("derived value").to.eq(result.item(2).property);
    });
});
describe("OrderBy", function () {
    it("should return the items in ascending order", function () {
        var array = [1, 4, 2, 3];
        var query = new Queryable_1.Queryable(array);
        var expected = [1, 2, 3, 4];
        var result = query.orderBy(function (i) { return i; });
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(expected[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
    it("should return the items in descending order", function () {
        var array = [1, 4, 2, 3];
        var query = new Queryable_1.Queryable(array);
        var expected = [4, 3, 2, 1];
        var result = query.orderByDescending(function (i) { return i; });
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(expected[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
});
describe("Skip", function () {
    it("should return the items after the skip length (2)", function () {
        var array = [1, 2, 3, 4];
        var query = new Queryable_1.Queryable(array);
        var expected = [3, 4];
        var result = query.skip(2);
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(expected[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
    it("should return the items after the skip length (0)", function () {
        var array = [1, 2, 3, 4];
        var query = new Queryable_1.Queryable(array);
        var expected = [1, 2, 3, 4];
        var result = query.skip(0);
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(expected[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
    it("should return the items after the skip length (4)", function () {
        var array = [1, 2, 3, 4];
        var query = new Queryable_1.Queryable(array);
        var expected = [];
        var result = query.skip(4);
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(expected[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
});
describe("Select", function () {
    it("should return a map of the set 1", function () {
        var array = [1, 2, 3, 4];
        var query = new Queryable_1.Queryable(array);
        var expected = [1, 2, 3, 4];
        var result = query.select(function (i) { return i; });
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(expected[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
    it("should return a map of the set 2", function () {
        var array = [1, 2, 3, 4];
        var query = new Queryable_1.Queryable(array);
        var expected = [2, 4, 6, 8];
        var result = query.select(function (i) { return i * 2; });
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(expected[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
});
describe("Sum", function () {
    it("should return the sum of the numbers", function () {
        var array = [1, 2, 3, 4];
        var query = new Queryable_1.Queryable(array);
        var result = query.sum(function (i) { return i; });
        chai_1.expect(10).to.eq(result);
    });
});
describe("Take", function () {
    it("should return a subset of items of the specified length (2)", function () {
        var array = [1, 2, 3, 4];
        var query = new Queryable_1.Queryable(array);
        var expected = [1, 2];
        var result = query.take(2);
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(expected[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
    it("should return a subset of items of the specified length (0)", function () {
        var array = [1, 2, 3, 4];
        var query = new Queryable_1.Queryable(array);
        var expected = [];
        var result = query.take(0);
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(expected[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
    it("should return a subset of items of the specified length (4)", function () {
        var array = [1, 2, 3, 4];
        var query = new Queryable_1.Queryable(array);
        var expected = [1, 2, 3, 4];
        var result = query.take(4);
        for (var i = 0; i < result.count; i++) {
            chai_1.expect(expected[i]).eq(result.item(i), "index " + i + " is not the same");
        }
    });
});
//# sourceMappingURL=Queryable.spec.js.map