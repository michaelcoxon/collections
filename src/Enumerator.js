"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Collection_1 = require("./Collection");
var Exceptions_1 = require("./Exceptions");
var Enumerator = (function () {
    function Enumerator(collectionOrArray) {
        // current pointer location
        this._pointer = -1;
        if (Array.isArray(collectionOrArray)) {
            // copy the array into this
            this._baseArray = collectionOrArray.slice();
        }
        else if (collectionOrArray instanceof Collection_1.Collection) {
            this._baseArray = collectionOrArray.toArray().slice();
        }
        else {
            throw new Exceptions_1.InvalidTypeException('collectionOrArray', 'Collection or Array');
        }
    }
    Object.defineProperty(Enumerator.prototype, "current", {
        // returns the current element
        get: function () {
            return this._baseArray[this._pointer];
        },
        enumerable: true,
        configurable: true
    });
    Enumerator.prototype.moveNext = function () {
        this._pointer++;
        return this._pointer < this._baseArray.length;
    };
    // returns the next element without moving the pointer forwards
    Enumerator.prototype.peek = function () {
        if (this._pointer >= this._baseArray.length) {
            throw new Exceptions_1.OutOfBoundsException("internal pointer", 0, this._baseArray.length - 1);
        }
        return this._baseArray[this._pointer + 1];
    };
    // reset the pointer to the start
    Enumerator.prototype.reset = function () {
        this._pointer = -1;
    };
    return Enumerator;
}());
exports.Enumerator = Enumerator;
Collection_1.Collection.prototype.getEnumerator = function () {
    return new Enumerator(this);
};
//# sourceMappingURL=Enumerator.js.map