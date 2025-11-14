const express = require("express");
const router = express.Router();
const taskCtrl = require("../controllers/taskController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const cacheMiddleware = require('../middleware/cacheMiddleware');
const roleRateLimiter = require('../middleware/roleRateLimiter');

// Create
router.post("/", authenticate, roleRateLimiter, taskCtrl.createTask);

// List
router.get("/", authenticate, roleRateLimiter, taskCtrl.getAllTasks);

// Get single
router.get("/:id", authenticate, roleRateLimiter, taskCtrl.getTaskById);

// Update
router.patch("/:id", authenticate, roleRateLimiter, taskCtrl.updateTask);

// Delete
router.delete("/:id", authenticate, roleRateLimiter, taskCtrl.deleteTask);

// Assign
router.post("/:id/assign", authenticate, roleRateLimiter, authorizeRoles("admin", "manager"), taskCtrl.assignTask);

module.exports = router;
