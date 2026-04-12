const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes
router.get("/", authenticateToken, dashboardController.getDashboard);
router.get("/insights", authenticateToken, dashboardController.getInsights);
router.get(
  "/digital-twin",
  authenticateToken,
  dashboardController.getDigitalTwin,
);

router.put(
  "/attendance",
  authenticateToken,
  dashboardController.updateAttendance,
);
router.put(
  "/study-hours",
  authenticateToken,
  dashboardController.updateStudyHours,
);
router.post("/activity", authenticateToken, dashboardController.logActivity);

module.exports = router;
