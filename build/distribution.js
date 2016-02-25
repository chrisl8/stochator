"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _float = require("./float");

var _float2 = _interopRequireDefault(_float);

var inverseNormalCumulativeDistribution = function inverseNormalCumulativeDistribution(probability) {
    var high = probability > 0.97575;
    var low = probability < 0.02425;
    var numCoefficients = undefined,
        denomCoeffcients = undefined,
        numMaxExponent = undefined,
        denomMaxExponent = undefined,
        coefficient = undefined,
        base = undefined;

    if (low || high) {
        numCoefficients = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968];
        denomCoeffcients = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

        numMaxExponent = 5;
        denomMaxExponent = 4;

        coefficient = low ? 1 : -1;
        base = Math.sqrt(-2 * Math.log(low ? probability : 1 - probability));
    } else {
        numCoefficients = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
        denomCoeffcients = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];

        numMaxExponent = 5;
        denomMaxExponent = 5;

        coefficient = probability - 0.5;
        base = Math.pow(coefficient, 2);
    }

    var mapMaxExp = function mapMaxExp(maxExp) {
        return function (value, index) {
            return value * Math.pow(base, maxExp - index);
        };
    };

    var sum = function sum(arr) {
        return arr.reduce(function (result, value) {
            return result + value;
        }, 0);
    };

    var numerator = sum(numCoefficients.map(mapMaxExp(numMaxExponent)));
    var denominator = sum(denomCoeffcients.map(mapMaxExp(denomMaxExponent))) + 1;

    return coefficient * numerator / denominator;
};

var randomNormallyDistributedFloat = function randomNormallyDistributedFloat(mean, stdev, min, max) {
    var prng = arguments.length <= 4 || arguments[4] === undefined ? Math.random : arguments[4];

    var seed = _float2["default"].boundedRandom(0, 1, prng);
    var result = inverseNormalCumulativeDistribution(seed) * stdev + mean;
    return min != null && max != null ? Math.min(max, Math.max(min, result)) : result;
};

exports["default"] = { randomNormallyDistributedFloat: randomNormallyDistributedFloat };
module.exports = exports["default"];