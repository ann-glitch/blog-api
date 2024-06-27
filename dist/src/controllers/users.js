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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getSingleUser = exports.getUsers = void 0;
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
// @description  Get all users
// @route  GET /api/v1/users
// @access  private
exports.getUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    const reqQuery = Object.assign({}, req.query);
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);
    query = User_1.default.find(reqQuery);
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    }
    else {
        query = query.sort("-createdAt");
    }
    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = yield User_1.default.countDocuments();
    query = query.skip(startIndex).limit(limit);
    const users = yield query;
    //pagination result
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }
    res.status(200).json({
        success: true,
        count: users.length,
        pagination,
        data: users,
    });
}));
// @description  Get Single user
// @route  GET /api/v1/users/:id
// @access  private
exports.getSingleUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.params.id);
    if (!user) {
        throw new errorResponse_1.default(`User not found with id of ${req.params.id}`, 404);
    }
    res.status(200).json({
        success: true,
        data: user,
    });
}));
// @description  Create user
// @route  POST /api/v1/users
// @access  private
exports.createUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.create(req.body);
    res.status(201).json({
        success: true,
        data: user,
    });
}));
// @description  Update User
// @route  PATCH /api/v1/users/:id
// @access  private
exports.updateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield User_1.default.findById(req.params.id);
    if (!user) {
        throw new errorResponse_1.default(`User not found with id of ${req.params.id}`, 404);
    }
    user = yield User_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: user,
    });
}));
// @description  Delete user
// @route  DELETE /api/v1/users/:id
// @access  private
exports.deleteUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.params.id);
    if (!user) {
        throw new errorResponse_1.default(`User not found with id of ${req.params.id}`, 404);
    }
    yield user.deleteOne();
    res.status(200).json({
        success: true,
        data: {},
    });
}));
