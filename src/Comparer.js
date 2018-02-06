"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utilities_1 = require("./Utilities");
var Exceptions_1 = require("./Exceptions");
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
            return _stringComparer.compare(Utilities_1.Utilities.getHash(x), Utilities_1.Utilities.getHash(y));
        }
    };
    DefaultObjectComparer.prototype.equals = function (x, y) {
        return Utilities_1.Utilities.equals(x, y, true);
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
            throw new Exceptions_1.UndefinedArgumentException("The comparer");
        }
    };
    CustomComparer.prototype.equals = function (x, y) {
        if (this._equalityComparer) {
            return this._equalityComparer(x, y);
        }
        else {
            throw new Exceptions_1.UndefinedArgumentException("The equality comparer");
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
//# sourceMappingURL=Comparer.js.map