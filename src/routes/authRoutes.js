const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authCtrl = require("../controllers/authControllers");
const { authenticate } = require("../middleware/authMiddleware");

// Register
router.post("/register",
  body("username").isLength({ min: 3 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  authCtrl.register
);

// Login
router.post("/login",
  body("identifier").notEmpty(),
  body("password").notEmpty(),
  authCtrl.login
);

// Logout
router.post("/logout", authCtrl.logout);

// Refresh
router.post("/refresh", authCtrl.refreshToken);

// Get current user profile
router.get("/me", authenticate, async (req, res) => {
  const User = require("../models/User");
  const user = await User.findById(req.user.id).select("-password -refreshToken");
  res.json(user);
});

module.exports = router;
