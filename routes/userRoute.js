import express from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controller/userController.js";
import { userAuth, adminAuth } from "../middlewares/auth.js";
const router = express.Router();

router.route("/").get(getAllUsers);
router
  .route("/:id")
  .patch(userAuth, updateUser)
  .delete(adminAuth, deleteUser);

export default router;
