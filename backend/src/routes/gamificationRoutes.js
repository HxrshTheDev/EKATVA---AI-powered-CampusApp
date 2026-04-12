const express = require("express");
const gamificationController = require("../controllers/gamificationController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes
router.get("/", authenticateToken, gamificationController.getGamification);
router.post("/streak", authenticateToken, gamificationController.updateStreak);
router.post(
  "/task/complete",
  authenticateToken,
  gamificationController.completeDailyTask,
);
router.post(
  "/mission/complete",
  authenticateToken,
  gamificationController.completeMission,
);
router.get(
  "/leaderboard",
  authenticateToken,
  gamificationController.getLeaderboard,
);
router.post(
  "/tasks/initialize",
  authenticateToken,
  gamificationController.initializeDailyTasks,
);

module.exports = router;
