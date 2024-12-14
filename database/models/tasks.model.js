import mongoose, { Types } from "mongoose";

const schema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      minLength: [2, "too short description name"],
    },
    employeeId: {
      type: Types.ObjectId,
      ref: "employee",
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const tasksModel = mongoose.model("task", schema);
