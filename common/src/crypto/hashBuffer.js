"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashBuffer = void 0;
var crypto_1 = __importDefault(require("crypto"));
var hashBuffer = function (buffer) {
    return crypto_1.default.createHash('sha256').update(buffer).digest();
};
exports.hashBuffer = hashBuffer;
//# sourceMappingURL=hashBuffer.js.map