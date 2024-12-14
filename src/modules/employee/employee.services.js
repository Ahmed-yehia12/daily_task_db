import { employeeModel } from "../../../database/models/employee.model.js";

export const addEmployee = async (params) => {
  const employee = new employeeModel(params);
  await employee.save();
};

export const fetchAllEmployees = async () => {
  const employees = await employeeModel.find();
  return employees;
};
