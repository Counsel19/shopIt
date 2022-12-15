import express from "express";
import {
  createCart,
  getUserCarts,
  updateCart,
  deleteCart,
} from "../controller/cartController.js";
import { userAuth } from "../middlewares/auth.js";
const router = express.Router();

router.route("/").post(userAuth, createCart).get(userAuth, getUserCarts);
router
  .route("/:cartId")
  .patch(userAuth, updateCart)
  .delete(userAuth, deleteCart);

export default router;
