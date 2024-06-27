"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const posts_1 = require("../controllers/posts");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route("/").get(posts_1.getPosts).post(auth_1.protect, posts_1.createPost);
router
    .route("/:id")
    .get(posts_1.getPost)
    .patch(auth_1.protect, posts_1.updatePost)
    .delete(auth_1.protect, posts_1.deletePost);
router.route("/:id/comments").post(auth_1.protect, posts_1.addComment);
module.exports = router;
