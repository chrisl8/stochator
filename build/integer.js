"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var boundedRandom = function boundedRandom() {
    var min = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var max = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
    var prng = arguments.length <= 2 || arguments[2] === undefined ? Math.random : arguments[2];

    var spread = 1 + max - min;
    return Math.floor(prng() * spread) + min;
};

var randomByte = function randomByte() {
    var prng = arguments.length <= 0 || arguments[0] === undefined ? Math.random : arguments[0];

    return boundedRandom(0, 255, prng);
};

exports["default"] = { boundedRandom: boundedRandom, randomByte: randomByte };
module.exports = exports["default"];