const express = require("express");
const router = express.Router();
const analyticsCtrl = require("../controllers/analytiicsController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const roleRateLimiter = require("../middleware/roleRateLimiter");

// protect analytics: only manager/admin
router.get("/overview", authenticate, roleRateLimiter, authorizeRoles("admin", "manager"), analyticsCtrl.overview);
router.get("/by-user", authenticate, roleRateLimiter, authorizeRoles("admin", "manager"), analyticsCtrl.byUser);

module.exports = router;