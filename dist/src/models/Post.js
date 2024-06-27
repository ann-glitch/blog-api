"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
// Mongoose schema definition
const PostSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a blog title"],
    },
    content: {
        type: String,
        required: [true, "Please write something! We are intrigued to read"],
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comments: [
        {
            type: String,
        },
    ],
    slug: String,
    featuredImage: {
        type: String,
        default: "no-photo.jpg",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
// Slugify middleware
PostSchema.pre("save", function (next) {
    this.slug = (0, slugify_1.default)(this.title, { lower: true });
    next();
});
const Post = mongoose_1.default.model("Post", PostSchema);
exports.default = Post;
