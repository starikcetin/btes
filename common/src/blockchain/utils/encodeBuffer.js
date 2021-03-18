"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeBuffer = void 0;
var bs58_1 = __importDefault(require("bs58"));
var encodeBuffer = function (buffer, encodingFor) {
    return encodingFor === 'address'
        ? bs58_1.default.encode(buffer)
        : buffer.toString('hex');
};
exports.encodeBuffer = encodeBuffer;
//# sourceMappingURL=encodeBuffer.js.map