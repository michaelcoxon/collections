/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("@michaelcoxon/utilities/lib/Exceptions");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Exceptions_1 = __webpack_require__(0);
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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("@michaelcoxon/utilities/lib/Utilities");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utilities = __webpack_require__(2);
var Exceptions_1 = __webpack_require__(0);
var DefaultComparer = /** @class */ (function () {
    function DefaultComparer() {
    }
    DefaultComparer.prototype.compare = function (x, y) {
        if (typeof x == 'string' && typeof y == 'string') {
            return _stringComparer.compare(x, y);
        }
        else if (typeof x == 'number' && typeof y == 'number') {
            return _numberComparer.compare(x, y);
        }
        else {
            return _objectComparer.compare(x, y);
        }
    };
    DefaultComparer.prototype.equals = function (x, y) {
        if (typeof x == 'string' && typeof y == 'string') {
            return _stringComparer.equals(x, y);
        }
        else if (typeof x == 'number' && typeof y == 'number') {
            return _numberComparer.equals(x, y);
        }
        else {
            return _objectComparer.equals(x, y);
        }
    };
    return DefaultComparer;
}());
exports.DefaultComparer = DefaultComparer;
var DefaultStringComparer = /** @class */ (function () {
    function DefaultStringComparer() {
    }
    DefaultStringComparer.prototype.compare = function (x, y) {
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    };
    DefaultStringComparer.prototype.equals = function (x, y) {
        return x === y;
    };
    return DefaultStringComparer;
}());
exports.DefaultStringComparer = DefaultStringComparer;
var DefaultNumberComparer = /** @class */ (function () {
    function DefaultNumberComparer() {
    }
    DefaultNumberComparer.prototype.compare = function (x, y) {
        return x - y;
    };
    DefaultNumberComparer.prototype.equals = function (x, y) {
        return x === y;
    };
    return DefaultNumberComparer;
}());
exports.DefaultNumberComparer = DefaultNumberComparer;
var DefaultObjectComparer = /** @class */ (function () {
    function DefaultObjectComparer() {
    }
    DefaultObjectComparer.prototype.compare = function (x, y) {
        if (x.toString() !== {}.toString() && y.toString() !== {}.toString()) {
            return _stringComparer.compare(x.toString(), y.toString());
        }
        else {
            return _stringComparer.compare(Utilities.getHash(x), Utilities.getHash(y));
        }
    };
    DefaultObjectComparer.prototype.equals = function (x, y) {
        return Utilities.equals(x, y, true);
    };
    return DefaultObjectComparer;
}());
exports.DefaultObjectComparer = DefaultObjectComparer;
var ReverseComparer = /** @class */ (function () {
    function ReverseComparer(comparer) {
        this._comparer = comparer;
    }
    ReverseComparer.prototype.compare = function (x, y) {
        return this._comparer.compare(y, x);
    };
    ReverseComparer.prototype.equals = function (x, y) {
        return this._comparer.equals(y, x);
    };
    return ReverseComparer;
}());
exports.ReverseComparer = ReverseComparer;
var CustomComparer = /** @class */ (function () {
    function CustomComparer(comparer, equalityComparer) {
        this._comparer = comparer;
        this._equalityComparer = equalityComparer;
    }
    CustomComparer.prototype.compare = function (x, y) {
        if (this._comparer) {
            return this._comparer(x, y);
        }
        else {
            throw new Exceptions_1.ArgumentUndefinedException("The comparer");
        }
    };
    CustomComparer.prototype.equals = function (x, y) {
        if (this._equalityComparer) {
            return this._equalityComparer(x, y);
        }
        else {
            throw new Exceptions_1.ArgumentUndefinedException("The equality comparer");
        }
    };
    return CustomComparer;
}());
exports.CustomComparer = CustomComparer;
var MapComparer = /** @class */ (function () {
    function MapComparer(comparer, selector) {
        this._comparer = comparer;
        this._selector = selector;
    }
    MapComparer.prototype.compare = function (x, y) {
        var x_value = this._selector(x);
        var y_value = this._selector(y);
        return this._comparer.compare(x_value, y_value);
    };
    MapComparer.prototype.equals = function (x, y) {
        var x_value = this._selector(x);
        var y_value = this._selector(y);
        return this._comparer.equals(x_value, y_value);
    };
    return MapComparer;
}());
exports.MapComparer = MapComparer;
var _stringComparer = new DefaultStringComparer();
var _numberComparer = new DefaultNumberComparer();
var _objectComparer = new DefaultObjectComparer();


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Collection_1 = __webpack_require__(1);
var Exceptions_1 = __webpack_require__(0);
var Enumerator = /** @class */ (function () {
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
            if (this._pointer >= this._baseArray.length || this._pointer < 0) {
                this.throwOutOfBoundsException();
            }
            return this._baseArray[this._pointer];
        },
        enumerable: true,
        configurable: true
    });
    Enumerator.prototype.moveNext = function () {
        if (this._pointer < this._baseArray.length) {
            this._pointer++;
        }
        return this._pointer < this._baseArray.length;
    };
    // returns the next element without moving the pointer forwards
    Enumerator.prototype.peek = function () {
        if (this._pointer + 1 >= this._baseArray.length) {
            this.throwOutOfBoundsException();
        }
        return this._baseArray[this._pointer + 1];
    };
    // reset the pointer to the start
    Enumerator.prototype.reset = function () {
        this._pointer = -1;
    };
    Enumerator.prototype.throwOutOfBoundsException = function () {
        throw new Exceptions_1.OutOfBoundsException("internal pointer", 0, this._baseArray.length - 1);
    };
    return Enumerator;
}());
exports.Enumerator = Enumerator;
Collection_1.Collection.prototype.getEnumerator = function () {
    return new Enumerator(this);
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

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
var Exceptions_1 = __webpack_require__(0);
var Utilities = __webpack_require__(2);
var Collection_1 = __webpack_require__(1);
var Comparer_1 = __webpack_require__(3);
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
                    found = Utilities.equals(item, obj);
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
                    found = Utilities.equals(item, obj);
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

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
var Collection_1 = __webpack_require__(1);
var Utilities = __webpack_require__(2);
var Exceptions_1 = __webpack_require__(0);
var Comparer_1 = __webpack_require__(3);
// public class jExt.Collections.Queryable
var Queryable = /** @class */ (function (_super) {
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
                s_value = Utilities.getHash(value);
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
    Queryable.prototype.first = function (predicate) {
        var set = predicate !== undefined
            ? this.where(predicate)
            : this;
        if (set._baseArray.length > 0) {
            return set._baseArray[0];
        }
        throw new Error("The collection is empty!");
    };
    Queryable.prototype.firstOrDefault = function (predicate) {
        var set = predicate !== undefined
            ? this.where(predicate)
            : this;
        if (set._baseArray.length > 0) {
            return set._baseArray[0];
        }
        return null;
    };
    Queryable.prototype.groupBy = function (propertyNameOrKeySelector) {
        var _this = this;
        var keySelector = this.createSelector(propertyNameOrKeySelector);
        var keySet = this.select(keySelector).distinct(function (k) { return k; });
        return keySet.select(function (key) { return new GroupedQueryable(_this, key, keySelector); });
    };
    Queryable.prototype.last = function (predicate) {
        var set = predicate !== undefined
            ? this.where(predicate)
            : this;
        if (set._baseArray.length > 0) {
            return set._baseArray[set._baseArray.length - 1];
        }
        throw new Error("The collection is empty!");
    };
    Queryable.prototype.lastOrDefault = function (predicate) {
        var set = predicate !== undefined
            ? this.where(predicate)
            : this;
        if (set._baseArray.length > 0) {
            return set._baseArray[set._baseArray.length - 1];
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
        if (typeof propertyNameOrSelector === 'string') {
            return function (a) {
                if (typeof a[propertyNameOrSelector] === 'function') {
                    throw new Exceptions_1.NotSupportedException("property names that are functions ('" + propertyNameOrSelector + "')");
                }
                return a[propertyNameOrSelector];
            };
        }
        else {
            return propertyNameOrSelector;
        }
    };
    return Queryable;
}(Collection_1.Collection));
exports.Queryable = Queryable;
var GroupedQueryable = /** @class */ (function () {
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
exports.GroupedQueryable = GroupedQueryable;
Collection_1.Collection.prototype.asQueryable = function () {
    return new Queryable(this);
};
Collection_1.Collection.prototype.ofType = function (type) {
    return this.asQueryable().where(function (item) { return item instanceof type; }).select(function (item) { return item; });
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*!
 * collections v1.0.0
 * ------------------------
 * Collections for JS and TypeScript
 * � 2017 Michael Coxon
 * https://github.com/michaelcoxon/collections#readme
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1));
__export(__webpack_require__(4));
__export(__webpack_require__(5));
__export(__webpack_require__(6));


/***/ })
/******/ ]);
//# sourceMappingURL=index.debug.js.map