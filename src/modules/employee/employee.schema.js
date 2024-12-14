import Joi from "joi";
import { objectIdValidation } from "../../middleware/validation.js";

export const createNewEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  date: Joi.date().required(),
}).required();
