"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exceptions_1 = require("./Exceptions");
var Collection = /** @class */ (function () {
    // constructor
    function Collection(collectionOrArray) {
        if (collectionOrArray === undefined) {
            this._baseArray = [];
        }
        else {
            this._baseArray = Collection.collectionOrArrayToArray(collectionOrArray);
        }
    }
    Object.defineProperty(Collection.prototype, "count", {
        get: function () {
            return this._baseArray.length;
        },
        enumerable: true,
        configurable: true
    });
    // Clones the Collection object
    Collection.prototype.clone = function () {
        return new Collection(this._baseArray.slice());
    };
    Collection.prototype.copyTo = function (into) {
        (_a = into._baseArray).push.apply(_a, this._baseArray);
        var _a;
    };
    // iterates over each item in the Collection. Return false to break.
    Collection.prototype.forEach = function (callback) {
        for (var i = 0; i < this._baseArray.length; i++) {
            if (false === callback(this._baseArray[i], i)) {
                break;
            }
        }
    };
    Collection.prototype.item = function (index) {
        return this._baseArray[index];
    };
    Collection.prototype.toArray = function () {
        return this._baseArray.slice();
    };
    Collection.collectionOrArrayToArray = function (collectionOrArray) {
        if (Array.isArray(collectionOrArray)) {
            // copy the array into this
            return collectionOrArray.slice();
        }
        else if (collectionOrArray instanceof Collection) {
            return collectionOrArray.toArray().slice();
        }
        else {
            throw new Exceptions_1.InvalidTypeException('collectionOrArray', 'Collection or Array');
        }
    };
    return Collection;
}());
exports.Collection = Collection;
//# sourceMappingURL=Collection.js.map