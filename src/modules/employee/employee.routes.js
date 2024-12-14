import { Router } from "express";
import * as employeeController from "./employee.controller.js";
import { asyncHandler } from "./../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.js";
import { createNewEmployeeSchema } from "./employee.schema.js";

const employeeRouter = Router();

employeeRouter.post(
  "/create_employee",
  validation(createNewEmployeeSchema),
  asyncHandler(employeeController.createNewEmployee)
);
employeeRouter.get("/", asyncHandler(employeeController.getAllEmployees));

export default employeeRouter;
