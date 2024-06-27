import { Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "express-async-handler";
import User from "../models/User";

// @description  Get all users
// @route  GET /api/v1/users
// @access  private
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ["select", "sort", "page", "limit"];

  removeFields.forEach((param) => delete reqQuery[param]);

  query = User.find(reqQuery);

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
  const total = await User.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const users = await query;

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
    count: users.length,
    pagination,
    data: users,
  });
});

// @description  Get Single user
// @route  GET /api/v1/users/:id
// @access  private
export const getSingleUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ErrorResponse(
        `User not found with id of ${req.params.id}`,
        404
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// @description  Create user
// @route  POST /api/v1/users
// @access  private
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @description  Update User
// @route  PATCH /api/v1/users/:id
// @access  private
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    throw new ErrorResponse(`User not found with id of ${req.params.id}`, 404);
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @description  Delete user
// @route  DELETE /api/v1/users/:id
// @access  private
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ErrorResponse(`User not found with id of ${req.params.id}`, 404);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
