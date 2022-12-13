import express from "express";
import {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productsController.js";
import { adminAuth } from "../middlewares/auth.js";
const router = express.Router();

router.route("/").post(adminAuth, createProduct).get(getAllProduct);
router
  .route("/:id")
  .put(adminAuth, updateProduct)
  .delete(adminAuth, deleteProduct);

export default router;
