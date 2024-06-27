"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/users.ts
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const router = express_1.default.Router({ mergeParams: true });
const auth_1 = require("../middleware/auth");
router.use(auth_1.protect);
router.use((0, auth_1.authorize)("admin"));
router.route("/").get(users_1.getUsers).post(users_1.createUser);
router.route("/:id").get(users_1.getSingleUser).patch(users_1.updateUser).delete(users_1.deleteUser);
exports.default = router;
