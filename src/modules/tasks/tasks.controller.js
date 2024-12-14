import { employeeModel } from "../../../database/models/employee.model.js";
import { tasksModel } from "../../../database/models/tasks.model.js";
import moment from "moment";
import mongoose, { Mongoose } from "mongoose";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import {
  addTask,
  deleteSingleTask,
  fetchTasks,
  getDaily,
  updateSingleTask,
} from "./task.services.js";

const createTask = async (req, res, next) => {
  const data = await addTask(req.body);
  res.json({ success: true, message: "Task created successfully", data });
};

// // update jop

const updateTask = async (req, res, next) => {
  const data = await updateSingleTask(req.params.id, req.body);
  res.json({ success: true, data });
};

// // delete Jop

const deleteTask = async (req, res, next) => {
  const data = await deleteSingleTask(req.params.id);
  res.json({ success: true, data });
};

//  get tasks by employee

const getAllTasks = async (req, res, next) => {
  const tasks = await fetchTasks(req.query);
  res.json({ success: true, tasks });
};

const getSingleTask = async (req, res, next) => {
  let data = await tasksModel
    .find({ employeeId: req.params.id })
    .populate("employeeId");
  if (!data) return next(new Error("task not found", { cause: 404 }));
  res.json({ success: true, data });
};

const getDailySummary = async (req, res, next) => {
  const data = await getDaily(req.body);
  res.json({
    success: true,
    totalHours: data.totalHours,
    remainingHours: data.remainingHours,
  });
};

export {
  createTask,
  getAllTasks,
  deleteTask,
  updateTask,
  getDailySummary,
  getSingleTask,
};
