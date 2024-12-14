import employeeRouter from "./employee/employee.routes.js";
import tasksRouter from "./tasks/tasks.routes.js";

export const bootstrap = (app) => {
  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/api/v1/employee", employeeRouter);
  app.use("/api/v1/tasks", tasksRouter);
};
//  mongodb+srv://User:cDCmn6YT6PZS7NXM@cluster0.a6vrp.mongodb.net/daily_task
// User
// cDCmn6YT6PZS7NXM 