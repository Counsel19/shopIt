import express from "express";
import {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} from "../controller/categoriesController.js";
import { adminAuth } from "../middlewares/auth.js";
const router = express.Router();

router.route("/").post(adminAuth, createCategory).get(getAllCategory);
router
  .route("/:id")
  .put(adminAuth, updateCategory)
  .delete(adminAuth, deleteCategory);

export default router;
