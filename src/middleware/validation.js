import { Types } from "mongoose";

export const objectIdValidation = (value, helper) => {
  if (Types.ObjectId.isValid(value)) return true;
  return helper.message("invalid object Id");
};

export const validation = (schema) => {
  return (req, res, next) => {
    let filter = {};
    if (req.file) {
      filter = { image: req.file, ...req.body, ...req.params, ...req.query };
    } else if (req.files) {
      filter = { ...req.files, ...req.body, ...req.params, ...req.query };
    } else {
      filter = { ...req.body, ...req.params, ...req.query };
    }

    const validationResult = schema.validate(filter, {
      abortEarly: false,
    });

    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map((obj) => {
        return obj.message;
      });
      return next(new Error(errorMessages, { cause: 400 }));
    }
    return next();
  };
};
