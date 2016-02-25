"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _integer = require("./integer");

var _integer2 = _interopRequireDefault(_integer);

var random = function random() {
    var prng = arguments.length <= 0 || arguments[0] === undefined ? Math.random : arguments[0];
    return Boolean(_integer2["default"].boundedRandom(0, 1, prng));
};

exports["default"] = { random: random };
module.exports = exports["default"];