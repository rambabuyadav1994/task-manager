import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController.js";

const router = Router();
const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

router.route("/").get(asyncHandler(getTasks)).post(asyncHandler(createTask));
router.patch("/:id/status", asyncHandler(updateTaskStatus));
router
  .route("/:id")
  .get(asyncHandler(getTask))
  .put(asyncHandler(updateTask))
  .delete(asyncHandler(deleteTask));

export default router;
