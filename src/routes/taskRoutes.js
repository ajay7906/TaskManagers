const express = require("express");
const router = express.Router();
const taskCtrl = require("../controllers/taskController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Create
router.post("/", authenticate, taskCtrl.createTask);

// List
router.get("/", authenticate, taskCtrl.getAllTasks);

// Get single
router.get("/:id", authenticate, taskCtrl.getTaskById);

// Update
router.put("/:id", authenticate, taskCtrl.updateTask);

// Delete
router.delete("/:id", authenticate, taskCtrl.deleteTask);

// Assign
router.post("/:id/assign", authenticate, authorizeRoles("admin", "manager"), taskCtrl.assignTask);

module.exports = router;
