import express from "express";
import { mongoConection } from "./database/dbConnection.js";
import { bootstrap } from "./src/modules/index.routes.js";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
const port = 3000;

dotenv.config();

app.use(cors());

await mongoConection();

app.use(express.json());
bootstrap(app);

app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
});

app.listen(process.env.PORT || port, () =>
  console.log(`Example app listening on port ${port}!`)
);
