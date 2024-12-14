

import { addEmployee, fetchAllEmployees } from "./employee.services.js";

//  Create new employee

const createNewEmployee = async (req, res, next) => {
  const employee = await addEmployee(req.body);
  res.json({ success: true, message: "user created successfuly", employee });
};

const getAllEmployees = async (req, res, next) => {
  const data = await fetchAllEmployees();
  res.json({ success: true, data });
};

export { createNewEmployee, getAllEmployees };
