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
exports.addComment = exports.deletePost = exports.updatePost = exports.createPost = exports.getPost = exports.getPosts = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Post_1 = __importDefault(require("../models/Post"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
// @description Get all posts
// @route GET /api/v1/posts
// @access Public
exports.getPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    const reqQuery = Object.assign({}, req.query);
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);
    query = Post_1.default.find(reqQuery);
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
    const limit = parseInt(req.query.limit, 10) || 2;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = yield Post_1.default.countDocuments();
    query = query.skip(startIndex).limit(limit);
    const posts = yield query;
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
        count: posts.length,
        pagination,
        data: posts,
    });
}));
// @description Get single post
// @route GET /api/v1/posts/:id
// @access Public
exports.getPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_1.default.findById(req.params.id);
    if (!post) {
        return next(new errorResponse_1.default(`Post with id ${req.params.id} does not exist`, 404));
    }
    res.status(200).json({
        success: true,
        data: post,
    });
}));
// @description Create new post
// @route POST /api/v1/posts
// @access Public
exports.createPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // add user to req.body
    req.body.author = req.user.id;
    const post = yield Post_1.default.create(req.body);
    res.status(201).json({
        success: true,
        data: post,
    });
}));
// @description Update post
// @route PUT /api/v1/posts/:id
// @access Private
exports.updatePost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let post = yield Post_1.default.findById(req.params.id);
    if (!post) {
        return next(new errorResponse_1.default(`Post with id ${req.params.id} does not exist`, 404));
    }
    post = yield Post_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: post,
    });
}));
// @description Delete post
// @route DELETE /api/v1/posts/:id
// @access Private
exports.deletePost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_1.default.findById(req.params.id);
    if (!post) {
        return next(new errorResponse_1.default(`Post with id ${req.params.id} does not exist`, 404));
    }
    yield post.deleteOne();
    res.status(200).json({
        success: true,
        data: {},
    });
}));
// @description Add comment to post
// @route POST /api/v1/posts/:id/comments
// @access Public
exports.addComment = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_1.default.findById(req.params.id);
    if (!post) {
        return next(new errorResponse_1.default(`Post with id ${req.params.id} does not exist`, 404));
    }
    post.comments.push(req.body.comment);
    yield post.save();
    res.status(200).json({
        success: true,
        data: post,
    });
}));
