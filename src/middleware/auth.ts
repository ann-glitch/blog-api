import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import ErrorResponse from "../utils/errorResponse";
import User, { UserDocument } from "../models/User";

interface AuthRequest extends Request {
  user?: UserDocument;
}

export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      // Set token from cookie
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };

      // Add user to request
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new ErrorResponse("Not authorized, user not found", 404));
      }

      req.user = user;

      next();
    } catch (err) {
      return next(new ErrorResponse("Not authorized, Please check token", 401));
    }
  }
);

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user?.role} not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
