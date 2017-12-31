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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Exceptions_1 = __webpack_require__(1);
var Collection = (function () {
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

/***/ }),
/* 1 */
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
var ArgumentException = (function (_super) {
    __extends(ArgumentException, _super);
    function ArgumentException(argumentName, message) {
        var _this = _super.call(this, "'" + argumentName + "' " + (message || "")) || this;
        _this.name = 'ArgumentException';
        return _this;
    }
    return ArgumentException;
}(Error));
exports.ArgumentException = ArgumentException;
var InvalidTypeException = (function (_super) {
    __extends(InvalidTypeException, _super);
    function InvalidTypeException(variableName, expectedTypeName) {
        var _this = _super.call(this, 'Type of ' + variableName + ' is not supported, ' + expectedTypeName + ' expected') || this;
        _this.name = 'InvalidTypeException';
        return _this;
    }
    return InvalidTypeException;
}(Error));
exports.InvalidTypeException = InvalidTypeException;
var NotImplementedException = (function (_super) {
    __extends(NotImplementedException, _super);
    function NotImplementedException(methodName) {
        var _this = _super.call(this, 'This method has not been implemented. "' + methodName + '"') || this;
        _this.name = 'NotImplementedException';
        return _this;
    }
    return NotImplementedException;
}(Error));
exports.NotImplementedException = NotImplementedException;
var NotSupportedException = (function (_super) {
    __extends(NotSupportedException, _super);
    function NotSupportedException(name) {
        var _this = _super.call(this, '"' + name + '" is not supported') || this;
        _this.name = 'NotSupportedException';
        return _this;
    }
    return NotSupportedException;
}(Error));
exports.NotSupportedException = NotSupportedException;
var OutOfBoundsException = (function (_super) {
    __extends(OutOfBoundsException, _super);
    function OutOfBoundsException(variableName, minBound, maxBound) {
        var _this = _super.call(this, 'The value of ' + variableName + ' is out of bounds. min: ' + minBound + ' max: ' + maxBound) || this;
        _this.name = 'OutOfBoundsException';
        return _this;
    }
    return OutOfBoundsException;
}(Error));
exports.OutOfBoundsException = OutOfBoundsException;
var UndefinedArgumentException = (function (_super) {
    __extends(UndefinedArgumentException, _super);
    function UndefinedArgumentException(argumentName) {
        var _this = _super.call(this, argumentName + ' is undefined') || this;
        _this.name = 'UndefinedArgumentException';
        return _this;
    }
    return UndefinedArgumentException;
}(Error));
exports.UndefinedArgumentException = UndefinedArgumentException;
var FileNotFoundException = (function (_super) {
    __extends(FileNotFoundException, _super);
    function FileNotFoundException(filename) {
        var _this = _super.call(this, "File '" + filename + "' is not found") || this;
        _this.name = 'FileNotFoundException';
        return _this;
    }
    return FileNotFoundException;
}(Error));
exports.FileNotFoundException = FileNotFoundException;
//# sourceMappingURL=Exceptions.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utilities;
(function (Utilities) {
    // returns true if the two objects are equal but not the same object. (compares public keys)
    function equals(obj1, obj2, forceJSON) {
        var state = false;
        forceJSON = forceJSON || false;
        if (!forceJSON) {
            for (var key in obj1) {
                if (obj1.hasOwnProperty(key)) {
                    state = obj1[key] == obj2[key];
                    if (!state) {
                        break;
                    }
                }
            }
        }
        else {
            state = equivilentToByJSON(obj1, obj2);
        }
        return state;
    }
    Utilities.equals = equals;
    // returns true if the two objects are equal but not the same object. (compares the JSON equilient of each object) .. should be faster.. should..
    function equivilentToByJSON(obj1, obj2) {
        return JSON.stringify(obj1) == JSON.stringify(obj2);
    }
    Utilities.equivilentToByJSON = equivilentToByJSON;
    // returns a hash of the object
    function getHash(o) {
        var hash = "";
        if (!!JSON && !!JSON.stringify) {
            for (var key in o) {
                if (o.hasOwnProperty(key)) {
                    hash += key + ":" + o[key];
                }
            }
        }
        else {
            hash = JSON.stringify(o);
        }
        return hash;
    }
    Utilities.getHash = getHash;
    // Returns the type of the object as a string
    function getType(o) {
        // null
        if (o === null) {
            return 'null';
        }
        // jquery
        if (o.fn !== undefined && o.fn.jquery !== undefined) {
            return 'jQuery';
        }
        // value types
        if (typeof (o) != 'object') {
            return typeof (o);
        }
        // MicrosoftAjax
        if (o.constructor.getName && o.constructor.getName() != null) {
            return o.constructor.getName();
        }
        // constructor method name
        if (o.constructor.name === undefined) {
            var name = o.constructor.toString().match(/^[\n\r\s]*function\s*([^\s(]+)/)[1];
            if (name != "") {
                return name;
            }
        }
        else {
            if (o.constructor.name != "")
                return o.constructor.name;
        }
        // fallback
        return typeof o;
    }
    Utilities.getType = getType;
})(Utilities = exports.Utilities || (exports.Utilities = {}));
//# sourceMappingURL=Utilities.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Collection_1 = __webpack_require__(0);
var Exceptions_1 = __webpack_require__(1);
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

/***/ }),
/* 4 */
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
var Exceptions_1 = __webpack_require__(1);
var Utilities_1 = __webpack_require__(2);
var Collection_1 = __webpack_require__(0);
var List = (function (_super) {
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
    List.prototype.sort = function (sortCondition) {
        if (!sortCondition) {
            sortCondition = function (a, b) {
                if (a.toString() > b.toString()) {
                    return 1;
                }
                if (a.toString() < b.toString()) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            };
        }
        this._baseArray.sort(sortCondition);
    };
    return List;
}(Collection_1.Collection));
exports.List = List;
Collection_1.Collection.prototype.toList = function () {
    return new List(this.toArray());
};
//# sourceMappingURL=List.js.map

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
// private helper functions
var Collection_1 = __webpack_require__(0);
var Utilities_1 = __webpack_require__(2);
// public class jExt.Collections.Queryable
var Queryable = (function (_super) {
    __extends(Queryable, _super);
    function Queryable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Queryable.prototype.all = function (comparer) {
        var output = true;
        output = this._baseArray.every(function (element) { return comparer(element); });
        return output;
    };
    Queryable.prototype.any = function (comparer) {
        var output = false;
        if (!Array.prototype.some) {
            output = !this.all(function (element) { return !comparer(element); });
        }
        else {
            output = this._baseArray.some(function (element) { return comparer(element); });
        }
        return output;
    };
    // Clones the Queryable object
    Queryable.prototype.clone = function () {
        return new Queryable(_super.prototype.clone.call(this));
    };
    // USAGE: obj.Distinct(); or obj.Distinct(['key1'],['key2']);
    Queryable.prototype.distinct = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        var hash;
        var hashIt = Utilities_1.Utilities.getHash;
        if (keys !== undefined && keys.length > 0) {
            var temp_1 = {};
            if (keys.length > 0) {
                hashIt = function (item) { return Utilities_1.Utilities.getHash(selectByArrayOfKeys(item, keys)); };
            }
            return this.where(function (item) {
                hash = hashIt(item);
                if (!temp_1[hash]) {
                    temp_1[hash] = true;
                    return true;
                }
                return false;
            });
        }
        else {
            var set = [];
            for (var i = 0; i < this._baseArray.length; i++) {
                if (set.indexOf(this._baseArray[i]) === -1) {
                    set.push(this._baseArray[i]);
                }
            }
            return new Queryable(set);
        }
        //throw new NotSupportedException("Only keyed objects, numbers and strings are supported");
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
    Queryable.prototype.groupBy = function (keys) {
        if (!Array.isArray(keys)) {
            return this.groupBy([keys]);
        }
        var pub = this;
        var uniqueSet = this
            .select(function (item) { return new GroupedQueryable(pub, selectByArrayOfKeys(item, keys)); })
            .distinct("key"); // distinct by the key
        uniqueSet = uniqueSet.orderBy(keys);
        return uniqueSet;
    };
    Queryable.prototype.ofType = function (ctor) {
        return this
            .where(function (item) { return item instanceof ctor; })
            .select(function (item) { return item; });
    };
    // Orders the set by specified keys where the first orderby 
    // param is first preference. the key can be a method name 
    // without parenthesis.
    // USAGE: obj.OrderBy(['key1 DESC','key2','key3 ASC']);
    //        obj.OrderBy('key1 DESC');
    //        obj.OrderBy(function (a,b) {});
    Queryable.prototype.orderBy = function (args) {
        if (this._baseArray.length > 0) {
            if (typeof args == 'string') {
                return this.orderBy([args]);
            }
            if (Array.isArray(args)) {
                var o = args.length - 1;
                var _loop_1 = function () {
                    if (typeof args[o] != 'string') {
                        throw new Error("Each key must be a string.");
                    }
                    var sortby = args[o].split(' ');
                    var key = sortby[0];
                    var direction = sortby[1] !== undefined ? sortby[1].toUpperCase() : 'ASC';
                    var directionModifier = 1;
                    if (direction == 'DESC') {
                        directionModifier = -1;
                    }
                    return { value: new Queryable(this_1.toArray().sort(function (a, b) {
                            if (typeof a[key] === 'function') {
                                return compare(a[key](), b[key]()) * directionModifier;
                            }
                            else {
                                return compare(a[key], b[key]) * directionModifier;
                            }
                        })) };
                };
                var this_1 = this;
                for (o; o != -1; o--) {
                    var state_1 = _loop_1();
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
            }
            if (typeof args == 'function') {
                return new Queryable(this.toArray().sort(args));
            }
            throw new Error("OrderBy type not supported.");
        }
        return new Queryable(this.toArray());
    };
    Queryable.prototype.skip = function (count) {
        var array = this.toArray();
        array.splice(0, count);
        return new Queryable(array);
    };
    // USAGE: obj.Select(['key1','key2','key3']); USAGE: obj.Select('key1');
    Queryable.prototype.select = function (args) {
        if (typeof args == "string") {
            if (args == "*") {
                throw new Error("Select type not required.");
            }
            return this.select([args]);
        }
        if (Array.isArray(args)) {
            return new Queryable(this._baseArray.map(function (obj) { return selectByArrayOfKeys(obj, args); }));
        }
        if (typeof args == 'function') {
            return new Queryable(this._baseArray.map(args));
        }
        throw new Error("Select type not supported.");
    };
    Queryable.prototype.sum = function (key) {
        return this.select(key)
            .toArray()
            .reduce(function (a, c) { return a + c; }, 0);
    };
    Queryable.prototype.take = function (count) {
        return new Queryable(this.toArray().splice(0, count));
    };
    // Returns the objects that evaluate true on the provided comparer function. 
    // USAGE: obj.Where(function() { return true; });
    Queryable.prototype.where = function (comparer) {
        return new Queryable(this._baseArray.filter(comparer));
    };
    return Queryable;
}(Collection_1.Collection));
exports.Queryable = Queryable;
var GroupedQueryable = (function () {
    function GroupedQueryable(parentQueryable, key) {
        this._parentQueryable = parentQueryable;
        this._key = key;
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
            return this._groupedRows || (this._groupedRows = this._parentQueryable.where(function (groupItem) {
                for (var keyName in _this._key) {
                    if (_this._key[keyName] != groupItem[keyName]) {
                        return false;
                    }
                }
                return true;
            }));
        },
        enumerable: true,
        configurable: true
    });
    return GroupedQueryable;
}());
function compare(a, b) {
    if (typeof a == 'string' && typeof b == 'string') {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }
    if (typeof a == 'number' && typeof b == 'number') {
        return a - b;
    }
    if (typeof a == 'object' && typeof b == 'object') {
        return compare(a.toString(), b.toString());
    }
    throw new TypeError("Cannot sort type of '" + Utilities_1.Utilities.getType(a) + "'.");
}
// USAGE: SelectByArrayOfKeys(obj, ['key1','key2','key3']);
function selectByArrayOfKeys(obj, keys) {
    var output = {};
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var item = keys_1[_i];
        var as = item.split(" as ");
        var key = void 0;
        var newKey = void 0;
        if (as.length > 1) {
            key = as[0];
            newKey = as[1];
        }
        else {
            key = item;
            newKey = item;
        }
        if (obj[key] !== undefined) {
            output[newKey] = obj[key];
        }
        else {
            throw new Error("Key '" + key + "' does not exist.");
        }
    }
    return output;
}
Collection_1.Collection.prototype.asQueryable = function () {
    return new Queryable(this);
};
Collection_1.Collection.prototype.ofType = function (type) {
    return this.asQueryable().where(function (item) { return item instanceof type; }).select(function (item) { return item; });
};
//# sourceMappingURL=Queryable.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*!
 * collections v1.0.0
 * ------------------------
 * Collections for JS and TypeScript
 * � 2017 Michael Coxon
 * https://github.com/michaelcoxon/collections#readme
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Collection_1 = __webpack_require__(0);
var Enumerator_1 = __webpack_require__(3);
var List_1 = __webpack_require__(4);
var Queryable_1 = __webpack_require__(5);
var Collections;
(function (Collections) {
    Collections.Collection = Collection_1.Collection;
    Collections.Enumerator = Enumerator_1.Enumerator;
    Collections.List = List_1.List;
    Collections.Queryable = Queryable_1.Queryable;
})(Collections = exports.Collections || (exports.Collections = {}));


/***/ })
/******/ ]);
//# sourceMappingURL=index.debug.js.map