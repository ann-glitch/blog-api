import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "express-async-handler";
import sendEmail from "../utils/sendEmail";
import User, { UserDocument } from "../models/User";

// @description  Register User
// @route   POST /api/v1/auth/register
// @access  public
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    //create user
    const user = await User.create({ name, email, password, role });

    sendTokenResponse(user, 200, res);
  }
);

// @description  Login User
// @route   POST /api/v1/auth/login
// @access  public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //validation for email & password
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 400)
      );
    }

    //check user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    //check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    sendTokenResponse(user, 200, res);
  }
);

// @description  Log User Out / Clear cookie
// @route   GET /api/v1/auth/logout
// @access  private
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);

// @description  Get logged in user
// @route   POST /api/v1/auth/me
// @access  private
export const getMe = asyncHandler(
  async (req: any, res: any, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// @description  Updater user details
// @route   PATCH /api/v1/auth/updatedetails
// @access  private
export const updateDetails = asyncHandler(
  async (req: any, res: any, next: NextFunction) => {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// @description  Update Password
// @route   PATCH /api/v1/auth/updatepassword
// @access  private
export const updatePassword = asyncHandler(
  async (req: any, res: any, next: NextFunction) => {
    const user = await User.findById(req.user?.id).select("+password");

    // Check if user and current password
    if (!user || (await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse("Password is incorrect", 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  }
);

// @description  Forgot Password
// @route   POST /api/v1/auth/forgotpassword
// @access  public
export const forgotPassword = asyncHandler(
  async (req: any, res: any, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorResponse("There is no user with that email", 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a patch request to the url below alongside your new password. \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      });
      res.status(200).json({ success: true, data: "Email sent!" });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  }
);

// @description  Reset Password
// @route   PATCH /api/v1/auth/resetpassword/:resettoken
// @access  public
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid token", 400));
    }

    //set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  }
);

//get token from model, create cookie and send response
const sendTokenResponse = (
  user: UserDocument,
  statusCode: number,
  res: Response
) => {
  //create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRE!, 10) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // if (process.env.NODE_ENV === "production") {
  //   options.secure = true;
  // }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
