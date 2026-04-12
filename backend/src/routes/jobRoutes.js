const express = require("express");
const jobController = require("../controllers/jobController");
const {
  authenticateToken,
} = require("../middleware/authMiddleware");
const {
  handleValidationErrors,
} = require("../middleware/validationMiddleware");
const {
  validateCreateJob,
  validatePagination,
} = require("../utils/validationRules");

const router = express.Router();

// IMPORTANT: Specific routes must come BEFORE parameterized routes
// Otherwise /:jobId would match "applications" as a jobId

// Protected routes - specific paths first
router.get(
  "/applications/my",
  authenticateToken,
  jobController.getUserApplications,
);
router.get("/matching", authenticateToken, jobController.getMatchingJobs);

// Public routes
router.get(
  "/",
  validatePagination,
  handleValidationErrors,
  jobController.getAllJobs,
);
router.get("/:jobId", jobController.getJobById);

// Protected routes - parameterized
router.post(
  "/",
  authenticateToken,
  validateCreateJob,
  handleValidationErrors,
  jobController.createJob,
);
router.post("/:jobId/apply", authenticateToken, jobController.applyForJob);

module.exports = router;
