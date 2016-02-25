"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _expanders, _generators;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _boolean = require("./boolean");

var _boolean2 = _interopRequireDefault(_boolean);

var _integer = require("./integer");

var _integer2 = _interopRequireDefault(_integer);

var _set = require("./set");

var _set2 = _interopRequireDefault(_set);

var _ret = require("ret");

var _ret2 = _interopRequireDefault(_ret);

var _discontinuousRange = require("discontinuous-range");

var _discontinuousRange2 = _interopRequireDefault(_discontinuousRange);

var _lodashRange = require("lodash.range");

var _lodashRange2 = _interopRequireDefault(_lodashRange);

var LOWERCASE_RANGE = [97, 122];

var UPPERCASE_RANGE = [65, 90];

var ASCII_RANGE = [32, 126];

var UNICODE_RANGE = [0, 65535];

var AsciiDRange = _discontinuousRange2["default"].apply(undefined, ASCII_RANGE);

var UnicodeDRange = _discontinuousRange2["default"].apply(undefined, UNICODE_RANGE);

var inRange = function inRange(_ref, n) {
    var _ref2 = _slicedToArray(_ref, 2);

    var min = _ref2[0];
    var max = _ref2[1];
    return n >= min && n <= max;
};

var changeCase = function changeCase(code) {
    var lowercase = inRange(LOWERCASE_RANGE, code);
    var uppercase = inRange(UPPERCASE_RANGE, code);
    return lowercase || uppercase ? code + (lowercase ? -32 : 32) : code;
};

var createChar = function createChar(code, ignoreCase, prng) {
    return code === null ? '' : String.fromCharCode(ignoreCase && _boolean2["default"].random(prng) ? changeCase(code) : code);
};

var expandCharacter = function expandCharacter(_ref3) {
    var value = _ref3.value;
    return (0, _discontinuousRange2["default"])(value);
};

var expandRange = function expandRange(_ref4) {
    var from = _ref4.from;
    var to = _ref4.to;
    return (0, _discontinuousRange2["default"])(from, to);
};

var expandSet = function expandSet(token, range) {
    var drange = (0, _discontinuousRange2["default"])();
    var setRanges = token.set.map(function (code) {
        return expand(code, range);
    });
    setRanges.forEach(function (setRange) {
        return drange.add(setRange);
    });
    return token.not ? range.clone().subtract(drange) : drange;
};

var expanders = (_expanders = {}, _defineProperty(_expanders, _ret2["default"].types.SET, expandSet), _defineProperty(_expanders, _ret2["default"].types.RANGE, expandRange), _defineProperty(_expanders, _ret2["default"].types.CHAR, expandCharacter), _expanders);

var expand = function expand(token) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return expanders[token.type].apply(expanders, [token].concat(args));
};

// These generators accept a token and the options object and return a character
// code.

var generateCharFromSet = function generateCharFromSet(token, _ref5) {
    var range = _ref5.range;
    var prng = _ref5.prng;

    var set = expand(token, range);
    return set.index(_integer2["default"].boundedRandom(0, set.length - 1, prng));
};

var generateCharFromRange = function generateCharFromRange(_ref6, _ref7) {
    var from = _ref6.from;
    var to = _ref6.to;
    var prng = _ref7.prng;
    return _integer2["default"].boundedRandom(from, to, prng);
};

var generateChar = function generateChar(_ref8) {
    var value = _ref8.value;
    return value;
};

var createCharGenerator = function createCharGenerator(func) {
    return function (token, _, _ref9) {
        var range = _ref9.range;
        var ignoreCase = _ref9.ignoreCase;
        var prng = _ref9.prng;
        return createChar(func(token, { range: range, ignoreCase: ignoreCase, prng: prng }), ignoreCase, prng);
    };
};

// These generators accept a token, the groups and the options and return a
// sequence of tokens, which are then in turn passed to generator functions.

var generateFromGroup = function generateFromGroup(_ref10, _, _ref11) {
    var notFollowedBy = _ref10.notFollowedBy;
    var options = _ref10.options;
    var stack = _ref10.stack;
    var prng = _ref11.prng;
    return notFollowedBy ? [] : options ? _set2["default"].randomMember(options, prng) : stack;
};

var generateRepeat = function generateRepeat(token, _, options) {
    var max = token.max === Infinity ? token.min + options.max : token.max;
    return (0, _lodashRange2["default"])(_integer2["default"].boundedRandom(token.min, max, options.prng)).map(function () {
        return token.value;
    });
};

var createSequenceGenerator = function createSequenceGenerator(func) {
    return function (token, groups, options) {
        return func(token, groups, options).map(function (value) {
            return generateFromToken(value, groups, options);
        }).join('');
    };
};

// Generator dispatch table based upon the token type.

var generators = (_generators = {}, _defineProperty(_generators, _ret2["default"].types.ROOT, createSequenceGenerator(generateFromGroup)), _defineProperty(_generators, _ret2["default"].types.GROUP, createSequenceGenerator(generateFromGroup)), _defineProperty(_generators, _ret2["default"].types.POSITION, function () {
    return '';
}), _defineProperty(_generators, _ret2["default"].types.REPETITION, createSequenceGenerator(generateRepeat)), _defineProperty(_generators, _ret2["default"].types.REFERENCE, function (_ref12, groups) {
    var value = _ref12.value;
    return groups[value - 1];
}), _defineProperty(_generators, _ret2["default"].types.CHAR, createCharGenerator(generateChar)), _defineProperty(_generators, _ret2["default"].types.SET, createCharGenerator(generateCharFromSet)), _defineProperty(_generators, _ret2["default"].types.RANGE, createCharGenerator(generateCharFromRange)), _generators);

var generateFromToken = function generateFromToken(token, groups, options) {
    var result = generators[token.type](token, groups, options);
    if (token.type === _ret2["default"].types.GROUP && token.remember) {
        groups.push(result);
    }
    return result;
};

var generateStringFromRange = function generateStringFromRange(range, expression, options) {
    return function () {
        return generateFromToken((0, _ret2["default"])(expression), [], _extends({ range: range }, options));
    };
};

// Exported public functions.

var generateCharacterFromRange = function generateCharacterFromRange(_ref13, _ref14) {
    var _ref132 = _slicedToArray(_ref13, 2);

    var min = _ref132[0];
    var max = _ref132[1];
    var prng = _ref14.prng;
    return generateStringFromRange((0, _discontinuousRange2["default"])(min, max), '.', { prng: prng });
};

var generateString = function generateString(unicode, expression, options) {
    return generateStringFromRange(unicode ? UnicodeDRange : AsciiDRange, expression, options);
};

var randomCharacterFromRange = function randomCharacterFromRange(range) {
    var prng = arguments.length <= 1 || arguments[1] === undefined ? Math.random : arguments[1];
    return generateCharacterFromRange(range, { prng: prng })();
};

var randomAsciiString = function randomAsciiString(expression, ignoreCase) {
    var prng = arguments.length <= 2 || arguments[2] === undefined ? Math.random : arguments[2];
    return generateStringFromRange(AsciiDRange, expression, { ignoreCase: ignoreCase, prng: prng });
};

var randomUnicodeString = function randomUnicodeString(expression, ignoreCase) {
    var prng = arguments.length <= 2 || arguments[2] === undefined ? Math.random : arguments[2];
    return generateStringFromRange(UnicodeDRange, expression, { ignoreCase: ignoreCase, prng: prng });
};

var randomAsciiCharacter = function randomAsciiCharacter() {
    var prng = arguments.length <= 0 || arguments[0] === undefined ? Math.random : arguments[0];
    return generateCharacterFromRange(ASCII_RANGE, { prng: prng })();
};

var randomLowercaseCharacter = function randomLowercaseCharacter() {
    var prng = arguments.length <= 0 || arguments[0] === undefined ? Math.random : arguments[0];
    return generateCharacterFromRange(LOWERCASE_RANGE, { prng: prng })();
};

var randomUnicodeCharacter = function randomUnicodeCharacter() {
    var prng = arguments.length <= 0 || arguments[0] === undefined ? Math.random : arguments[0];
    return generateCharacterFromRange(UNICODE_RANGE, { prng: prng })();
};

var randomUppercaseCharacter = function randomUppercaseCharacter() {
    var prng = arguments.length <= 0 || arguments[0] === undefined ? Math.random : arguments[0];
    return generateCharacterFromRange(UPPERCASE_RANGE, { prng: prng })();
};

exports["default"] = {
    generateString: generateString,
    randomCharacterFromRange: randomCharacterFromRange,
    randomAsciiString: randomAsciiString,
    randomUnicodeString: randomUnicodeString,
    randomAsciiCharacter: randomAsciiCharacter,
    randomLowercaseCharacter: randomLowercaseCharacter,
    randomUnicodeCharacter: randomUnicodeCharacter,
    randomUppercaseCharacter: randomUppercaseCharacter
};
module.exports = exports["default"];