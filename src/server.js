// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const rateLimit = require("express-rate-limit");
// const connectDB = require("./config/db");
// // const authRoutes = require("./routes/auth.routes");
// // const taskRoutes = require("./routes/task.routes");
// // const swaggerUi = require("swagger-ui-express");
// // const swaggerSpec = require("./docs/swagger");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Rate limiter
// const limiter = rateLimit({
//   windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
//   max: Number(process.env.RATE_LIMIT_MAX || 100),
//   message: "Too many requests from this IP, please try again later"
// });
// app.use(limiter);

// // Routes
// // app.use("/api/auth", authRoutes);
// // app.use("/api/tasks", taskRoutes);

// // // Swagger UI
// // app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Basic health
// app.get("/", (req, res) => res.send("Task Manager API is running"));

// // Start server after DB connect
// const PORT = process.env.PORT || 4000;
// connectDB(process.env.MONGO_URI).then(() => {
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../doc/swagger");

const app = express();

app.use(cors());
app.use(express.json());

// Rate limiter
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  message: "Too many requests from this IP, please try again later"
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Swagger UI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic health
app.get("/", (req, res) => res.send("Task Manager API is running"));

// Start server after DB connect
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/task-manager").then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
