import Joi from "joi";
import { objectIdValidation } from "./../../middleware/validation.js";

export const addTaskSchema = Joi.object({
  description: Joi.string().trim().required(),
  employeeId: Joi.custom(objectIdValidation),
  from: Joi.date().required(),
  to: Joi.date().required(),
}).required();

export const idSchema = Joi.object({
  id: Joi.custom(objectIdValidation).required(),
}).required();

export const updateTaskSchema = Joi.object({
  id: Joi.custom(objectIdValidation).required(),
  description: Joi.string().trim(),
  employeeId: Joi.custom(objectIdValidation),
  from: Joi.date(),
  to: Joi.date(),
}).required();

export const dailySummrySchema = Joi.object({
  employeeId: Joi.custom(objectIdValidation).required(),
}).required();
