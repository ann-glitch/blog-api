import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
} from "../controllers/posts";
import { protect } from "../middleware/auth";

const router = express.Router();

router.route("/").get(getPosts).post(protect, createPost);

router
  .route("/:id")
  .get(getPost)
  .patch(protect, updatePost)
  .delete(protect, deletePost);

router.route("/:id/comments").post(protect, addComment);

export default router;
