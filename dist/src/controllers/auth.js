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
exports.resetPassword = exports.forgotPassword = exports.updatePassword = exports.updateDetails = exports.getMe = exports.logout = exports.login = exports.register = void 0;
const crypto_1 = __importDefault(require("crypto"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const User_1 = __importDefault(require("../models/User"));
// @description  Register User
// @route   POST /api/v1/auth/register
// @access  public
exports.register = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    //create user
    const user = yield User_1.default.create({ name, email, password, role });
    sendTokenResponse(user, 200, res);
}));
// @description  Login User
// @route   POST /api/v1/auth/login
// @access  public
exports.login = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //validation for email & password
    if (!email || !password) {
        return next(new errorResponse_1.default("Please provide an email and password", 400));
    }
    //check user
    const user = yield User_1.default.findOne({ email }).select("+password");
    if (!user) {
        return next(new errorResponse_1.default("Invalid Credentials", 401));
    }
    //check if password matches
    const isMatch = yield user.matchPassword(password);
    if (!isMatch) {
        return next(new errorResponse_1.default("Invalid Credentials", 401));
    }
    sendTokenResponse(user, 200, res);
}));
// @description  Log User Out / Clear cookie
// @route   GET /api/v1/auth/logout
// @access  private
exports.logout = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        data: {},
    });
}));
// @description  Get logged in user
// @route   POST /api/v1/auth/me
// @access  private
exports.getMe = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user,
    });
}));
// @description  Updater user details
// @route   PATCH /api/v1/auth/updatedetails
// @access  private
exports.updateDetails = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
    };
    const user = yield User_1.default.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: user,
    });
}));
// @description  Update Password
// @route   PATCH /api/v1/auth/updatepassword
// @access  private
exports.updatePassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select("+password");
    // Check if user and current password
    if (!user || (yield user.matchPassword(req.body.currentPassword))) {
        return next(new errorResponse_1.default("Password is incorrect", 401));
    }
    user.password = req.body.newPassword;
    yield user.save();
    sendTokenResponse(user, 200, res);
}));
// @description  Forgot Password
// @route   POST /api/v1/auth/forgotpassword
// @access  public
exports.forgotPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new errorResponse_1.default("There is no user with that email", 404));
    }
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    yield user.save({ validateBeforeSave: false });
    // Create reset url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a patch request to the url below alongside your new password. \n\n ${resetUrl}`;
    try {
        yield (0, sendEmail_1.default)({
            email: user.email,
            subject: "Password reset token",
            message,
        });
        res.status(200).json({ success: true, data: "Email sent!" });
    }
    catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new errorResponse_1.default("Email could not be sent", 500));
    }
}));
// @description  Reset Password
// @route   PATCH /api/v1/auth/resetpassword/:resettoken
// @access  public
exports.resetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get hashed token
    const resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.resettoken)
        .digest("hex");
    const user = yield User_1.default.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new errorResponse_1.default("Invalid token", 400));
    }
    //set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    yield user.save();
    sendTokenResponse(user, 200, res);
}));
//get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() +
            parseInt(process.env.JWT_COOKIE_EXPIRE, 10) * 24 * 60 * 60 * 1000),
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
