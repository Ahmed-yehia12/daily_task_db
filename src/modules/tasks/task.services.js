import { employeeModel } from "../../../database/models/employee.model.js";
import { tasksModel } from "../../../database/models/tasks.model.js";
import moment from "moment";
import mongoose, { Mongoose } from "mongoose";
import { ApiFeatures } from "../../utils/apiFeatures.js";

export const addTask = async (params) => {
  const employeeId = new mongoose.Types.ObjectId(params.employeeId);

  // Validate `from` and `to` in the request
  const from = moment(params.from);
  const to = moment(params.to);

  // Calculate the duration of the new task in milliseconds
  const newTaskDurationMs = to.diff(from); // Difference in milliseconds

  if (newTaskDurationMs <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid task duration." });
  }

  // Get today's start and end times
  const startOfToday = moment().startOf("day").toDate();
  const endOfToday = moment().endOf("day").toDate();

  // Use aggregation to calculate the total duration of today's tasks in milliseconds
  const result = await tasksModel.aggregate([
    {
      $match: {
        employeeId,
        $or: [
          { from: { $gte: startOfToday, $lt: endOfToday } }, // Tasks starting today
          { to: { $gte: startOfToday, $lt: endOfToday } }, // Tasks ending today
        ],
      },
    },
    {
      $project: {
        durationMs: { $subtract: ["$to", "$from"] }, // Calculate the duration for each task
      },
    },
    {
      $group: {
        _id: null,
        totalDurationMs: { $sum: "$durationMs" }, // Sum all durations
      },
    },
  ]);

  // Extract total duration or default to 0 if no tasks exist
  const existingTasksDurationMs = result[0]?.totalDurationMs || 0;

  // Define 8 hours in milliseconds
  const eightHoursInMs = 8 * 60 * 60 * 1000;

  // Check if the total duration exceeds the limit
  const totalDurationMs = existingTasksDurationMs + newTaskDurationMs;
  if (totalDurationMs > eightHoursInMs) {
    return res.status(400).json({
      success: false,
      message: "Cannot add the task. Total duration exceeds 8 hours.",
    });
  }

  // Create and save the new task
  const task = new tasksModel(params);
  await task.save();
  return task;
};

export const updateSingleTask = async (id, params) => {
  if (params.from || params.to) {
    const singleTask = await tasksModel.findById(id).populate("employeeId");
    const employeeId = new mongoose.Types.ObjectId(singleTask.employeeId._id);

    // Validate `from` and `to` in the request
    const from = moment(params.from);
    const to = moment(params.to);

    // Calculate the duration of the new task in milliseconds
    const newTaskDurationMs = to.diff(from); // Difference in milliseconds

    if (newTaskDurationMs <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task duration." });
    }

    // Get today's start and end times
    const startOfToday = moment().startOf("day").toDate();
    const endOfToday = moment().endOf("day").toDate();

    // Use aggregation to calculate the total duration of today's tasks in milliseconds
    const result = await tasksModel.aggregate([
      {
        $match: {
          employeeId,
          $or: [
            { from: { $gte: startOfToday, $lt: endOfToday } }, // Tasks starting today
            { to: { $gte: startOfToday, $lt: endOfToday } },
          ],
          $and: [
            { _id: { $ne: new mongoose.Types.ObjectId(id) } }, // Tasks ending today
          ],
        },
      },
      {
        $project: {
          durationMs: { $subtract: ["$to", "$from"] }, // Calculate the duration for each task
        },
      },
      {
        $group: {
          _id: null,
          totalDurationMs: { $sum: "$durationMs" }, // Sum all durations
        },
      },
    ]);

    // Extract total duration or default to 0 if no tasks exist
    const existingTasksDurationMs = result[0]?.totalDurationMs || 0;

    // Define 8 hours in milliseconds
    const eightHoursInMs = 8 * 60 * 60 * 1000;

    // Check if the total duration exceeds the limit
    const totalDurationMs = existingTasksDurationMs + newTaskDurationMs;
    if (totalDurationMs > eightHoursInMs) {
      return res.status(400).json({
        success: false,
        message: "Cannot add the task. Total duration exceeds 8 hours.",
      });
    }
  }

  const data = await tasksModel.findByIdAndUpdate(id, params, {
    new: true,
  });
  !data &&
    res.status("404").json({ success: false, message: "data not found" });

  return data;
};

export const deleteSingleTask = async (id) => {
  const task = await tasksModel.findByIdAndDelete(id);
  !task &&
    res.status("404").json({ success: false, message: "task not found" });
};

export const fetchTasks = async (query) => {
  let apiFeatures = new ApiFeatures(
    tasksModel.find().populate("employeeId"),
    query
  )
    .pagination()
    .filter();

  const tasks = await apiFeatures.mongooseQuery;

  if (!tasks) return next(new Error("task not found", { cause: 404 }));
  return tasks;
};

export const getDaily = async (params) => {
  const employeeId = new mongoose.Types.ObjectId(params.employeeId);
  // Get today's start and end times
  const startOfToday = moment().startOf("day").toDate();
  const endOfToday = moment().endOf("day").toDate();

  // Use aggregation to calculate the total duration of today's tasks in milliseconds
  const result = await tasksModel.aggregate([
    {
      $match: {
        employeeId,
        $or: [
          { from: { $gte: startOfToday, $lt: endOfToday } }, // Tasks starting today
          { to: { $gte: startOfToday, $lt: endOfToday } }, // Tasks ending today
        ],
      },
    },
    {
      $project: {
        durationMs: { $subtract: ["$to", "$from"] }, // Calculate the duration for each task
      },
    },
    {
      $group: {
        _id: null,
        totalDurationMs: { $sum: "$durationMs" }, // Sum all durations
      },
    },
  ]);

  // Extract total duration or default to 0 if no tasks exist
  const existingTasksDurationMs = result[0]?.totalDurationMs || 0;

  // Define 8 hours in milliseconds
  const eightHoursInMs = 8 * 60 * 60 * 1000;

  const totalHours = existingTasksDurationMs;
  const remainingHours = eightHoursInMs - totalHours;
  const tasks = await tasksModel.find({ employeeId });
  return {
    totalHours,
    remainingHours,
  };
};
