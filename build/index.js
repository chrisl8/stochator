"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lodashIdentity = require("lodash.identity");

var _lodashIdentity2 = _interopRequireDefault(_lodashIdentity);

var _lodashIsfunction = require("lodash.isfunction");

var _lodashIsfunction2 = _interopRequireDefault(_lodashIsfunction);

var _lodashIsregexp = require("lodash.isregexp");

var _lodashIsregexp2 = _interopRequireDefault(_lodashIsregexp);

var _lodashIsstring = require("lodash.isstring");

var _lodashIsstring2 = _interopRequireDefault(_lodashIsstring);

var _lodashRange = require("lodash.range");

var _lodashRange2 = _interopRequireDefault(_lodashRange);

var _boolean = require("./boolean");

var _boolean2 = _interopRequireDefault(_boolean);

var _color = require("./color");

var _color2 = _interopRequireDefault(_color);

var _distribution = require("./distribution");

var _distribution2 = _interopRequireDefault(_distribution);

var _float = require("./float");

var _float2 = _interopRequireDefault(_float);

var _integer = require("./integer");

var _integer2 = _interopRequireDefault(_integer);

var _seedrandom = require("seedrandom");

var _seedrandom2 = _interopRequireDefault(_seedrandom);

var _set = require("./set");

var _set2 = _interopRequireDefault(_set);

var _string = require("./string");

var _string2 = _interopRequireDefault(_string);

var booleanGenerator = function booleanGenerator(_ref2) {
    var prng = _ref2.prng;
    return function () {
        return _boolean2["default"].random(prng);
    };
};

var colorGenerator = function colorGenerator(_ref3) {
    var prng = _ref3.prng;
    return function () {
        return _color2["default"].randomRgb(prng);
    };
};

var floatGenerator = function floatGenerator(_ref4) {
    var min = _ref4.min;
    var max = _ref4.max;
    var mean = _ref4.mean;
    var prng = _ref4.prng;
    var stdev = _ref4.stdev;

    if (mean && stdev) {
        return function () {
            return _distribution2["default"].randomNormallyDistributedFloat(mean, stdev, min, max, prng);
        };
    } else {
        return function () {
            return _float2["default"].boundedRandom(min, max, prng);
        };
    }
};

var integerGenerator = function integerGenerator(_ref5) {
    var min = _ref5.min;
    var max = _ref5.max;
    var prng = _ref5.prng;

    return function () {
        return _integer2["default"].boundedRandom(min, max, prng);
    };
};

var setGenerator = function setGenerator(_ref6) {
    var values = _ref6.values;
    var prng = _ref6.prng;
    var _ref6$replacement = _ref6.replacement;
    var replacement = _ref6$replacement === undefined ? true : _ref6$replacement;
    var _ref6$shuffle = _ref6.shuffle;
    var shuffle = _ref6$shuffle === undefined ? false : _ref6$shuffle;
    var _ref6$weights = _ref6.weights;
    var weights = _ref6$weights === undefined ? null : _ref6$weights;

    if (!values || !values.length) {
        throw Error("Must provide a 'values' array for a set generator.");
    }

    if (shuffle) {
        return function () {
            return _set2["default"].shuffle(values, prng);
        };
    } else if (replacement) {
        if (weights) {
            return function () {
                return _set2["default"].weightedRandomMember(values, weights, prng);
            };
        } else {
            return function () {
                return _set2["default"].randomMember(values, prng);
            };
        }
    } else {
        return function () {
            return _set2["default"].randomMemberWithoutReplacement(values, prng);
        };
    }
};

var stringGenerator = function stringGenerator(_ref7) {
    var kind = _ref7.kind;
    var _ref7$expression = _ref7.expression;
    var expression = _ref7$expression === undefined ? "[" + kind + "]" : _ref7$expression;
    var _ref7$ignoreCase = _ref7.ignoreCase;
    var ignoreCase = _ref7$ignoreCase === undefined ? false : _ref7$ignoreCase;
    var _ref7$maxWildcard = _ref7.maxWildcard;
    var maxWildcard = _ref7$maxWildcard === undefined ? 100 : _ref7$maxWildcard;
    var prng = _ref7.prng;
    var _ref7$unicode = _ref7.unicode;
    var unicode = _ref7$unicode === undefined ? false : _ref7$unicode;
    return (function () {
        var isRe = (0, _lodashIsregexp2["default"])(expression);
        var exprSource = isRe ? expression.source : expression;
        var options = {
            ignoreCase: ignoreCase || isRe && expression.ignoreCase,
            maxWildcard: maxWildcard,
            prng: prng
        };
        return _string2["default"].generateString(unicode, exprSource, options);
    })();
};

var KIND_GENERATORS = {
    "boolean": booleanGenerator,
    "float": floatGenerator,
    "integer": integerGenerator,
    "set": setGenerator,
    "color": colorGenerator,
    "rgb": colorGenerator,
    "string": stringGenerator,
    "a-z": stringGenerator,
    "A-Z": stringGenerator
};

var VALID_KINDS = Object.keys(KIND_GENERATORS);

var validateKind = function validateKind(kind) {
    if (VALID_KINDS.indexOf(kind) !== -1) {
        return true;
    }
    throw Error(kind + " is in invalid kind. Valid kinds include:\n    " + VALID_KINDS.join(', '));
};

var getConfigWithDefaults = function getConfigWithDefaults(rawConfig) {
    return _extends({ kind: "float" }, rawConfig, { prng: getPrng(rawConfig) });
};

var createGenerator = function createGenerator(rawConfig) {
    var config = getConfigWithDefaults(rawConfig);
    validateKind(config.kind);
    return KIND_GENERATORS[config.kind](config);
};

var getNextValueGenerator = function getNextValueGenerator(configs) {
    configs[0] = configs[0] ? configs[0] : {};
    var generators = (function () {
        var _generators = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = configs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var config = _step.value;

                _generators.push(createGenerator(config));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return _generators;
    })();
    if (generators.length === 1) {
        return function () {
            return generators[0]();
        };
    } else {
        return function () {
            return (function () {
                var _ref = [];
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = generators[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var generator = _step2.value;

                        _ref.push(generator());
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                            _iterator2["return"]();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return _ref;
            })();
        };
    }
};

var getPrng = function getPrng(_ref8) {
    var seed = _ref8.seed;
    var prng = _ref8.prng;

    var defaultPrng = seed ? _seedrandom2["default"] : Math.random;
    var basePrng = prng ? prng : defaultPrng;
    return seed ? basePrng(seed) : basePrng;
};

var parseArgs = function parseArgs(args) {
    var defaults = { configs: [], mutator: null, name: null };
    return args.reduce(function (result, arg) {
        if (result.mutator || (0, _lodashIsstring2["default"])(arg)) {
            result.name = arg;
        } else if ((0, _lodashIsfunction2["default"])(arg)) {
            result.mutator = arg;
        } else {
            result.configs.push(arg);
        }
        return result;
    }, defaults);
};

var Stochator = (function () {
    _createClass(Stochator, null, [{
        key: "fromDistribution",
        value: {
            normal: _distribution2["default"].randomNormallyDistributedFloat
        },
        enumerable: true
    }, {
        key: "randomAsciiCharacter",
        value: _string2["default"].randomAsciiCharacter,
        enumerable: true
    }, {
        key: "randomAsciiString",
        value: _string2["default"].randomAsciiString,
        enumerable: true
    }, {
        key: "randomBoolean",
        value: _boolean2["default"].random,
        enumerable: true
    }, {
        key: "randomByte",
        value: _integer2["default"].randomByte,
        enumerable: true
    }, {
        key: "randomCharacterFromRange",
        value: _string2["default"].randomCharacterFromRange,
        enumerable: true
    }, {
        key: "randomColor",
        value: _color2["default"].randomRgb,
        enumerable: true
    }, {
        key: "randomFloat",
        value: _float2["default"].boundedRandom,
        enumerable: true
    }, {
        key: "randomInteger",
        value: _integer2["default"].boundedRandom,
        enumerable: true
    }, {
        key: "randomLowercaseCharacter",
        value: _string2["default"].randomLowercaseCharacter,
        enumerable: true
    }, {
        key: "randomSetMember",
        value: _set2["default"].randomMember,
        enumerable: true
    }, {
        key: "randomSetMemberWithoutReplacement",
        value: _set2["default"].randomMemberWithoutReplacement,
        enumerable: true
    }, {
        key: "randomUnicodeCharacter",
        value: _string2["default"].randomUnicodeCharacter,
        enumerable: true
    }, {
        key: "randomUnicodeString",
        value: _string2["default"].randomUnicodeString,
        enumerable: true
    }, {
        key: "randomUppercaseCharacter",
        value: _string2["default"].randomUppercaseCharacter,
        enumerable: true
    }, {
        key: "shuffleSet",
        value: _set2["default"].shuffleSet,
        enumerable: true
    }, {
        key: "weightedRandomSetMember",
        value: _set2["default"].weightedRandomMember,
        enumerable: true
    }]);

    function Stochator() {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _classCallCheck(this, Stochator);

        this.VERSION = "0.6";
        this._value = 0;

        var _parseArgs = parseArgs(args);

        var configs = _parseArgs.configs;
        var mutator = _parseArgs.mutator;
        var name = _parseArgs.name;

        // If the mutator is provided, override the default identity func.
        this.mutate = mutator ? function (nextValue) {
            return mutator(nextValue, _this.getValue());
        } : _lodashIdentity2["default"];

        // Transform the configs to a func to get the next value.
        var getNext = getNextValueGenerator(configs);

        // Assign `name` to the next mutated value(s), after `times` iterations.
        // If `times` is 1, just return the value, otherwise return an array.
        this.next = function () {
            var times = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

            var values = (function () {
                var _values = [];
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = (0, _lodashRange2["default"])(1, times + 1)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var time = _step3.value;

                        _values.push(_this.setValue(_this.mutate(getNext())));
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                            _iterator3["return"]();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                return _values;
            })();
            return times == 1 ? values[0] : values;
        };

        if (name) {
            this[name] = function () {
                return _this.next.apply(_this, arguments);
            };
        }
    }

    _createClass(Stochator, [{
        key: "getValue",
        value: function getValue() {
            return this._value;
        }
    }, {
        key: "setValue",
        value: function setValue(value) {
            this._value = value;
            return this._value;
        }
    }, {
        key: "toString",
        value: function toString() {
            return "[object Stochator]";
        }
    }]);

    return Stochator;
})();

exports["default"] = Stochator;

if (global) {
    global.Stochator = Stochator;
}
module.exports = exports["default"];