// routes/users.ts
import express from "express";
import {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users";

const router = express.Router({ mergeParams: true });
import { protect, authorize } from "../middleware/auth";

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);

export default router;
