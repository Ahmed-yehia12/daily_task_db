import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.js";
import * as tasksController from "./tasks.controller.js";
import {
  addTaskSchema,
  dailySummrySchema,
  idSchema,
  updateTaskSchema,
} from "./tasks.schema.js";

const tasksRouter = Router();

tasksRouter.post(
  "/daily_summry",
  validation(dailySummrySchema),
  asyncHandler(tasksController.getDailySummary)
);

tasksRouter.get(
  "/:id",
  validation(idSchema),
  asyncHandler(tasksController.getSingleTask)
);
tasksRouter.get("/", asyncHandler(tasksController.getAllTasks));

tasksRouter.post(
  "/create_task",
  validation(addTaskSchema),
  asyncHandler(tasksController.createTask)
);

tasksRouter.put(
  "/:id",
  validation(updateTaskSchema),
  asyncHandler(tasksController.updateTask)
);

tasksRouter.delete(
  "/:id",
  validation(idSchema),
  asyncHandler(tasksController.deleteTask)
);

export default tasksRouter;
