import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDatabase } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 5000;
const localOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const configuredOrigins = (process.env.CORS_ORIGIN || localOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? configuredOrigins
    : [...new Set([...configuredOrigins, ...localOrigins])];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      const error = new Error("This origin is not allowed by CORS.");
      error.statusCode = 403;
      callback(error);
    },
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Task Manager API is running." });
});
app.use("/api/tasks", taskRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Task Manager API listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(`Unable to start the API: ${error.message}`);
    process.exitCode = 1;
  });
