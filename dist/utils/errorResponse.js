"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Maintaining proper stack trace (only available on V8 engines like Node.js)
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = ErrorResponse;
