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
var ArgumentException = /** @class */ (function (_super) {
    __extends(ArgumentException, _super);
    function ArgumentException(argumentName, message) {
        var _this = _super.call(this, "'" + argumentName + "' " + (message || "")) || this;
        _this.name = 'ArgumentException';
        return _this;
    }
    return ArgumentException;
}(Error));
exports.ArgumentException = ArgumentException;
var InvalidTypeException = /** @class */ (function (_super) {
    __extends(InvalidTypeException, _super);
    function InvalidTypeException(variableName, expectedTypeName) {
        var _this = _super.call(this, 'Type of ' + variableName + ' is not supported, ' + expectedTypeName + ' expected') || this;
        _this.name = 'InvalidTypeException';
        return _this;
    }
    return InvalidTypeException;
}(Error));
exports.InvalidTypeException = InvalidTypeException;
var NotImplementedException = /** @class */ (function (_super) {
    __extends(NotImplementedException, _super);
    function NotImplementedException(methodName) {
        var _this = _super.call(this, 'This method has not been implemented. "' + methodName + '"') || this;
        _this.name = 'NotImplementedException';
        return _this;
    }
    return NotImplementedException;
}(Error));
exports.NotImplementedException = NotImplementedException;
var NotSupportedException = /** @class */ (function (_super) {
    __extends(NotSupportedException, _super);
    function NotSupportedException(name) {
        var _this = _super.call(this, '"' + name + '" is not supported') || this;
        _this.name = 'NotSupportedException';
        return _this;
    }
    return NotSupportedException;
}(Error));
exports.NotSupportedException = NotSupportedException;
var OutOfBoundsException = /** @class */ (function (_super) {
    __extends(OutOfBoundsException, _super);
    function OutOfBoundsException(variableName, minBound, maxBound) {
        var _this = _super.call(this, 'The value of ' + variableName + ' is out of bounds. min: ' + minBound + ' max: ' + maxBound) || this;
        _this.name = 'OutOfBoundsException';
        return _this;
    }
    return OutOfBoundsException;
}(Error));
exports.OutOfBoundsException = OutOfBoundsException;
var UndefinedArgumentException = /** @class */ (function (_super) {
    __extends(UndefinedArgumentException, _super);
    function UndefinedArgumentException(argumentName) {
        var _this = _super.call(this, argumentName + ' is undefined') || this;
        _this.name = 'UndefinedArgumentException';
        return _this;
    }
    return UndefinedArgumentException;
}(Error));
exports.UndefinedArgumentException = UndefinedArgumentException;
var FileNotFoundException = /** @class */ (function (_super) {
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