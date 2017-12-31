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