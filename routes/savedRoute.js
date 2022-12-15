import express from "express";
import {
  createSaved,
  getUserSaveds,
  updateSaved,
  deleteSaved,
} from "../controller/savedController.js";
import { userAuth } from "../middlewares/auth.js";
const router = express.Router();

router.route("/").post(userAuth, createSaved).get(userAuth, getUserSaveds);
router
  .route("/:savedId")
  .patch(userAuth, updateSaved)
  .delete(userAuth, deleteSaved);

export default router;
