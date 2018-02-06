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
var Exceptions_1 = require("./Exceptions");
var Utilities_1 = require("./Utilities");
var Collection_1 = require("./Collection");
var Comparer_1 = require("./Comparer");
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    List.prototype.add = function (obj) {
        this._baseArray.push(obj);
    };
    List.prototype.addRange = function (collectionOrArray) {
        var array = Collection_1.Collection.collectionOrArrayToArray(collectionOrArray);
        // make sure we have items
        if (array.length > 0) {
            this._baseArray = this._baseArray.concat(array);
        }
        else {
            throw new Exceptions_1.ArgumentException('collectionOrArray', "No elements in collectionOrArray");
        }
    };
    List.prototype.clear = function () {
        this._baseArray.length = 0;
    };
    List.prototype.contains = function (obj, isEquivilent) {
        var ret = false;
        if (this.find(obj, isEquivilent || false) != undefined) {
            ret = true;
        }
        return ret;
    };
    List.prototype.find = function (obj, isEquivilent) {
        if (isEquivilent === void 0) { isEquivilent = false; }
        if (isEquivilent) {
            for (var _i = 0, _a = this._baseArray; _i < _a.length; _i++) {
                var item = _a[_i];
                var found = false;
                if (isEquivilent) {
                    found = Utilities_1.Utilities.equals(item, obj);
                }
                if (found) {
                    return item;
                }
            }
        }
        else {
            var index = this.findIndex(obj);
            if (index !== undefined) {
                return this.item(index);
            }
            else {
                return undefined;
            }
        }
    };
    List.prototype.findIndex = function (obj, isEquivilent) {
        if (isEquivilent === void 0) { isEquivilent = false; }
        if (isEquivilent) {
            var index_1 = undefined;
            this.forEach(function (item, i) {
                var found = false;
                if (isEquivilent) {
                    found = Utilities_1.Utilities.equals(item, obj);
                }
                else {
                    found = item == obj;
                }
                if (found) {
                    index_1 = i;
                    return false;
                }
            });
            return index_1;
        }
        else {
            var index = this._baseArray.indexOf(obj);
            if (index == -1) {
                return undefined;
            }
            return index;
        }
    };
    List.prototype.insertAt = function (obj, index) {
        this._baseArray.splice(index, 0, obj);
    };
    List.prototype.prepend = function (obj) {
        this.insertAt(obj, 0);
    };
    List.prototype.prependRange = function (collectionOrArray) {
        var array = Collection_1.Collection.collectionOrArrayToArray(collectionOrArray);
        (_a = this._baseArray).splice.apply(_a, [0, 0].concat(array));
        var _a;
    };
    List.prototype.remove = function (obj) {
        var index = this.findIndex(obj);
        if (index != undefined) {
            this.removeAt(index);
        }
        else {
            throw new Error("Not in array");
        }
    };
    List.prototype.removeAt = function (index) {
        this._baseArray.splice(index, 1);
    };
    List.prototype.sort = function (comparer) {
        if (comparer === void 0) { comparer = new Comparer_1.DefaultComparer(); }
        this._baseArray.sort(function (a, b) { return comparer.compare(a, b); });
    };
    return List;
}(Collection_1.Collection));
exports.List = List;
Collection_1.Collection.prototype.toList = function () {
    return new List(this.toArray());
};
//# sourceMappingURL=List.js.map