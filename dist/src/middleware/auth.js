"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const User_1 = __importDefault(require("../models/User"));
exports.protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies.token) {
        // Set token from cookie
        token = req.cookies.token;
    }
    // Make sure token exists
    if (!token) {
        return next(new errorResponse_1.default("Not authorized to access this route", 401));
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Add user to request
        const user = yield User_1.default.findById(decoded.id);
        if (!user) {
            return next(new errorResponse_1.default("Not authorized, user not found", 404));
        }
        req.user = user;
        next();
    }
    catch (err) {
        return next(new errorResponse_1.default("Not authorized, Please check token", 401));
    }
}));
const authorize = (...roles) => {
    return (req, res, next) => {
        var _a;
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new errorResponse_1.default(`User role ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.role} not authorized to access this route`, 403));
        }
        next();
    };
};
exports.authorize = authorize;
