"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _integer = require("./integer");

var _integer2 = _interopRequireDefault(_integer);

var randomRgb = function randomRgb() {
    var prng = arguments.length <= 0 || arguments[0] === undefined ? Math.random : arguments[0];

    return {
        red: _integer2["default"].randomByte(prng),
        green: _integer2["default"].randomByte(prng),
        blue: _integer2["default"].randomByte(prng)
    };
};

exports["default"] = { randomRgb: randomRgb };
module.exports = exports["default"];