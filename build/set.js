"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _float = require("./float");

var _float2 = _interopRequireDefault(_float);

var _integer = require("./integer");

var _integer2 = _interopRequireDefault(_integer);

var randomMember = function randomMember(values) {
    var prng = arguments.length <= 1 || arguments[1] === undefined ? Math.random : arguments[1];

    var max = values.length - 1;
    return values[_integer2["default"].boundedRandom(0, max, prng)];
};

var randomMemberWithoutReplacement = function randomMemberWithoutReplacement(values) {
    var prng = arguments.length <= 1 || arguments[1] === undefined ? Math.random : arguments[1];

    if (values.length > 0) {
        var _index = _integer2["default"].boundedRandom(0, values.length - 1, prng);
        var value = values[_index];
        values.splice(_index, 1);
        return value;
    }
};

var weightedRandomMember = function weightedRandomMember(values, weights) {
    var prng = arguments.length <= 2 || arguments[2] === undefined ? Math.random : arguments[2];
    var member = undefined;
    var weightSum = 0;

    var threshold = _float2["default"].boundedRandom(0, 1, prng);

    values.forEach(function (value, index) {
        if (member) {
            return;
        }
        var weight = weights[index];
        if (threshold <= weightSum + weight && threshold >= weightSum) {
            member = value;
        }
        weightSum += weight;
    });

    return member;
};

var shuffle = function shuffle(values) {
    var prng = arguments.length <= 1 || arguments[1] === undefined ? Math.random : arguments[1];

    var valuesRef = [].concat(_toConsumableArray(values));
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = range(0, valuesRef.length)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            index = _step.value;

            randomIndex = _integer2["default"].boundedRandom(0, index, prng);

            tmp = valuesRef[index];
            valuesRef[index] = valuesRef[randomIndex];
            valuesRef[randomIndex] = tmp;
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

    return valuesRef;
};

exports["default"] = {
    randomMember: randomMember,
    randomMemberWithoutReplacement: randomMemberWithoutReplacement,
    weightedRandomMember: weightedRandomMember,
    shuffle: shuffle
};
module.exports = exports["default"];