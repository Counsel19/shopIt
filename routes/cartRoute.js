import express from "express";
import {
  createCart,
  getAllCart,
  updateCart,
  deleteCart,
} from "../controller/categoriesController.js";
import { userAuth } from "../middlewares/auth.js";
const router = express.Router();

router.route("/").post(userAuth, createCart).get(getAllCart);
router
  .route("/:id")
  .patch(userAuth, updateCart)
  .delete(userAuth, deleteCart);

export default router;
