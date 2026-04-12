const express = require("express");
const authController = require("../controllers/authController");
const {
  authenticateToken,
} = require("../middleware/authMiddleware");
const {
  handleValidationErrors,
} = require("../middleware/validationMiddleware");
const { validateRegister, validateLogin } = require("../utils/validationRules");

const router = express.Router();

// Public routes
router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  authController.register,
);
router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  authController.login,
);

// Protected routes
router.get("/profile", authenticateToken, authController.getProfile);
router.put("/profile", authenticateToken, authController.updateProfile);

// Connection routes
router.post(
  "/connect/request",
  authenticateToken,
  authController.sendConnectionRequest,
);
router.post(
  "/connect/accept",
  authenticateToken,
  authController.acceptConnectionRequest,
);

module.exports = router;
