require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../doc/swagger");
const reteLimit = require('express-rate-limit');
const http = require('http')
const initSocket = require('./socket');
const redis = require('./config/redis');
const analyticsRoutes = require("./routes/analyticsRoutes");
const yaml = require('yamljs')


const app = express();
const server = http.createServer(app)

app.use(cors());
app.use(express.json());




// Rate limiter
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  message: "Too many requests from this IP, please try again later"
});
app.use(limiter);

app.set('redis', redis);


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);


// Swagger UI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic health
app.get("/", (req, res) => res.send("Task Manager API is running"));

// Start server after DB connect
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/task-manager").then(() => {
  const io = initSocket(server);
  app.set('io', io);
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
