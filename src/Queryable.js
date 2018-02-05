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
// private helper functions
var Collection_1 = require("./Collection");
var Utilities_1 = require("./Utilities");
var Comparer_1 = require("./Comparer");
// public class jExt.Collections.Queryable
var Queryable = (function (_super) {
    __extends(Queryable, _super);
    function Queryable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Queryable.prototype.all = function (predicate) {
        var output = true;
        output = this._baseArray.every(function (element) { return predicate(element); });
        return output;
    };
    Queryable.prototype.any = function (predicate) {
        if (predicate !== undefined) {
            var output = false;
            if (!Array.prototype.some) {
                output = !this.all(function (element) { return !predicate(element); });
            }
            else {
                output = this._baseArray.some(function (element) { return predicate(element); });
            }
            return output;
        }
        else {
            return this._baseArray.length > 0;
        }
    };
    Queryable.prototype.average = function (propertyNameOrSelector) {
        var selector = this.createSelector(propertyNameOrSelector);
        var sum = this.sum(function (item) { return selector(item); });
        return sum / this.count;
    };
    // Clones the Queryable object
    Queryable.prototype.clone = function () {
        return new Queryable(_super.prototype.clone.call(this));
    };
    Queryable.prototype.distinct = function (propertyNameOrSelector) {
        if (this._baseArray.length === 0) {
            return this.asQueryable();
        }
        var selector = this.createSelector(propertyNameOrSelector);
        var temp = {};
        return this.where(function (item) {
            var value = selector(item);
            var s_value;
            if (value instanceof Object) {
                s_value = Utilities_1.Utilities.getHash(value);
            }
            else {
                s_value = "" + value;
            }
            if (!temp[s_value]) {
                temp[s_value] = true;
                return true;
            }
            return false;
        });
    };
    Queryable.prototype.first = function () {
        if (this._baseArray.length > 0) {
            return this._baseArray[0];
        }
        throw new Error("The collection is empty!");
    };
    Queryable.prototype.firstOrDefault = function () {
        if (this._baseArray.length > 0) {
            return this._baseArray[0];
        }
        return null;
    };
    Queryable.prototype.groupBy = function (propertyNameOrKeySelector) {
        var _this = this;
        var keySelector = this.createSelector(propertyNameOrKeySelector);
        var keySet = this.select(keySelector).distinct(function (k) { return k; });
        return keySet.select(function (key) { return new GroupedQueryable(_this, key, keySelector); });
    };
    Queryable.prototype.last = function () {
        if (this._baseArray.length > 0) {
            return this._baseArray[this._baseArray.length - 1];
        }
        throw new Error("The collection is empty!");
    };
    Queryable.prototype.lastOrDefault = function () {
        if (this._baseArray.length > 0) {
            return this._baseArray[this._baseArray.length - 1];
        }
        return null;
    };
    Queryable.prototype.max = function (propertyNameOrSelector) {
        var selector = this.createSelector(propertyNameOrSelector);
        var values = this.select(function (item) { return selector(item); }).toArray();
        return Math.max.apply(Math, values);
    };
    Queryable.prototype.min = function (propertyNameOrSelector) {
        var selector = this.createSelector(propertyNameOrSelector);
        var values = this.select(function (item) { return selector(item); }).toArray();
        return Math.min.apply(Math, values);
    };
    Queryable.prototype.ofType = function (ctor) {
        return this
            .where(function (item) { return item instanceof ctor; })
            .select(function (item) { return item; });
    };
    Queryable.prototype.orderBy = function (propertyNameOrSelector, comparer) {
        return this.internalOrderBy(this.createSelector(propertyNameOrSelector), comparer || new Comparer_1.DefaultComparer());
    };
    Queryable.prototype.orderByDescending = function (propertyNameOrSelector, comparer) {
        return this.internalOrderBy(this.createSelector(propertyNameOrSelector), new Comparer_1.ReverseComparer(comparer || new Comparer_1.DefaultComparer()));
    };
    Queryable.prototype.skip = function (count) {
        var array = this.toArray();
        array.splice(0, count);
        return new Queryable(array);
    };
    Queryable.prototype.select = function (propertyNameOrSelector) {
        var selector = this.createSelector(propertyNameOrSelector);
        return new Queryable(this._baseArray.map(function (item) { return selector(item); }));
    };
    Queryable.prototype.sum = function (propertyNameOrSelector) {
        var selector = this.createSelector(propertyNameOrSelector);
        return this.select(function (item) { return selector(item); })
            .toArray()
            .reduce(function (a, c) { return a + c; }, 0);
    };
    Queryable.prototype.take = function (count) {
        return new Queryable(this.toArray().splice(0, count));
    };
    // Returns the objects that evaluate true on the provided comparer function. 
    // USAGE: obj.Where(function() { return true; });
    Queryable.prototype.where = function (predicate) {
        return new Queryable(this._baseArray.filter(predicate));
    };
    Queryable.prototype.internalOrderBy = function (selector, comparer) {
        var mapComparer = new Comparer_1.MapComparer(comparer, selector);
        return new Queryable(this.toArray().sort(function (a, b) { return mapComparer.compare(a, b); }));
    };
    Queryable.prototype.createSelector = function (propertyNameOrSelector) {
        var selector;
        if (typeof propertyNameOrSelector === 'string') {
            selector = function (a) { return a[propertyNameOrSelector]; };
        }
        else {
            selector = propertyNameOrSelector;
        }
        return selector;
    };
    return Queryable;
}(Collection_1.Collection));
exports.Queryable = Queryable;
var GroupedQueryable = (function () {
    function GroupedQueryable(parentQueryable, key, keySelector) {
        this._parentQueryable = parentQueryable;
        this._key = key;
        this._keySelector = keySelector;
    }
    Object.defineProperty(GroupedQueryable.prototype, "key", {
        get: function () {
            return this._key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GroupedQueryable.prototype, "groupedRows", {
        get: function () {
            var _this = this;
            var comparer = new Comparer_1.DefaultComparer();
            return this._groupedRows || (this._groupedRows = this._parentQueryable.where(function (item) { return comparer.equals(_this._keySelector(item), _this._key); }));
        },
        enumerable: true,
        configurable: true
    });
    return GroupedQueryable;
}());
Collection_1.Collection.prototype.asQueryable = function () {
    return new Queryable(this);
};
Collection_1.Collection.prototype.ofType = function (type) {
    return this.asQueryable().where(function (item) { return item instanceof type; }).select(function (item) { return item; });
};
//# sourceMappingURL=Queryable.js.map