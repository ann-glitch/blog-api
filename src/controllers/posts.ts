import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import Post from "../models/Post";
import ErrorResponse from "../utils/errorResponse";

// @description Get all posts
// @route GET /api/v1/posts
// @access Public
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ["select", "sort", "page", "limit"];

  removeFields.forEach((param) => delete reqQuery[param]);

  query = Post.find(reqQuery);

  if (req.query.select) {
    const fields = (req.query.select as string).split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = (req.query.sort as string).split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //pagination
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const posts = await query;

  //pagination result
  const pagination: any = {};

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
});

// @description Get single post
// @route GET /api/v1/posts/:id
// @access Public
export const getPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(
        new ErrorResponse(`Post with id ${req.params.id} does not exist`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  }
);

// @description Create new post
// @route POST /api/v1/posts
// @access Public
export const createPost = asyncHandler(async (req: any, res: any) => {
  // add user to req.body
  req.body.author = req.user.id;

  const post = await Post.create(req.body);
  res.status(201).json({
    success: true,
    data: post,
  });
});

// @description Update post
// @route PUT /api/v1/posts/:id
// @access Private
export const updatePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return next(
        new ErrorResponse(`Post with id ${req.params.id} does not exist`, 404)
      );
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: post,
    });
  }
);

// @description Delete post
// @route DELETE /api/v1/posts/:id
// @access Private
export const deletePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(
        new ErrorResponse(`Post with id ${req.params.id} does not exist`, 404)
      );
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);

// @description Add comment to post
// @route POST /api/v1/posts/:id/comments
// @access Public
export const addComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(
        new ErrorResponse(`Post with id ${req.params.id} does not exist`, 404)
      );
    }

    post.comments.push(req.body.comment);
    await post.save();

    res.status(200).json({
      success: true,
      data: post,
    });
  }
);
