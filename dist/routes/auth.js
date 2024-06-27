"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/register", auth_1.register);
router.post("/login", auth_1.login);
router.get("/logout", auth_1.logout);
router.get("/me", auth_2.protect, auth_1.getMe);
router.patch("/updatedetails", auth_2.protect, auth_1.updateDetails);
router.patch("/updatepassword", auth_2.protect, auth_1.updatePassword);
router.post("/forgotpassword", auth_1.forgotPassword);
router.patch("/resetpassword/:resettoken", auth_1.resetPassword);
exports.default = router;
