"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Collection_1 = require("../src/Collection");
var Enumerator_1 = require("../src/Enumerator");
var chai_1 = require("chai");
require("mocha");
describe("Create an enumerator", function () {
    it("should return an enumerator from a collection", function () {
        var array = [1, 2, 3, 4];
        var coll = new Collection_1.Collection(array);
        var en = new Enumerator_1.Enumerator(coll);
        var count = 0;
        while (en.moveNext()) {
            chai_1.expect(coll.item(count)).eq(en.current, "index " + count + " is not the same");
            count++;
        }
    });
    it("should return an enumerator from an array", function () {
        var array = [1, 2, 3, 4];
        var en = new Enumerator_1.Enumerator(array);
        var count = 0;
        while (en.moveNext()) {
            chai_1.expect(array[count]).eq(en.current, "index " + count + " is not the same");
            count++;
        }
    });
    it("should return an enumerator using the extension method", function () {
        var array = [1, 2, 3, 4];
        var coll = new Collection_1.Collection(array);
        var en = coll.getEnumerator();
        var count = 0;
        while (en.moveNext()) {
            chai_1.expect(coll.item(count)).eq(en.current, "index " + count + " is not the same");
            count++;
        }
    });
});
describe("Move to the next item in an enumerator", function () {
    it("should move to the next item in the enumerator", function () {
        var array = [1, 2, 3, 4];
        var coll = new Collection_1.Collection(array);
        var en = new Enumerator_1.Enumerator(coll);
        var count = 0;
        while (en.moveNext()) {
            chai_1.expect(coll.item(count)).eq(en.current, "index " + count + " is not the same");
            count++;
        }
    });
    it("should return false when moving past the end of the enumerator", function () {
        var array = [1, 2, 3, 4];
        var coll = new Collection_1.Collection(array);
        var en = new Enumerator_1.Enumerator(coll);
        var count = 0;
        while (en.moveNext()) {
            chai_1.expect(coll.item(count)).eq(en.current, "index " + count + " is not the same");
            count++;
        }
        chai_1.expect(false).to.eq(en.moveNext());
    });
});
describe("Move to the next item in an enumerator", function () {
    it("should return the next item in the enumerator without advancing", function () {
        var array = [1, 2, 3, 4];
        var coll = new Collection_1.Collection(array);
        var en = new Enumerator_1.Enumerator(coll);
        var count = 0;
        chai_1.expect(1).to.eq(en.peek());
        while (en.moveNext()) {
            chai_1.expect(coll.item(count)).eq(en.current, "index " + count + " is not the same");
            count++;
        }
    });
    it("should throw an execption when cannot peek", function () {
        var array = [1, 2, 3, 4];
        var coll = new Collection_1.Collection(array);
        var en = new Enumerator_1.Enumerator(coll);
        var count = 0;
        while (en.moveNext()) {
            chai_1.expect(coll.item(count)).eq(en.current, "index " + count + " is not the same");
            count++;
        }
        try {
            en.peek();
            chai_1.assert.fail(undefined, undefined, "Should not be able to see past end of enumerable");
        }
        catch (ex) { }
    });
});
describe("Reset the enumerator", function () {
    it("should move to the start of the enumerator", function () {
        var array = [1, 2, 3, 4];
        var coll = new Collection_1.Collection(array);
        var en = new Enumerator_1.Enumerator(coll);
        var count = 0;
        while (en.moveNext()) {
            chai_1.expect(coll.item(count)).eq(en.current, "index " + count + " is not the same");
            count++;
        }
        en.reset();
        count = 0;
        while (en.moveNext()) {
            chai_1.expect(coll.item(count)).eq(en.current, "index " + count + " is not the same");
            count++;
        }
    });
});
//# sourceMappingURL=Enumerator.spec.js.map