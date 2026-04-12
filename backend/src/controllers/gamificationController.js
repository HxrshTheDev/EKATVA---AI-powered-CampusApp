const gamificationService = require("../services/gamificationService");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

class GamificationController {
  // Get gamification data
  async getGamification(req, res, next) {
    try {
      const gamification = await gamificationService.getGamification(
        req.user.id,
      );

      sendSuccess(res, gamification, "Gamification data retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Update daily streak
  async updateStreak(req, res, next) {
    try {
      const streakData = await gamificationService.updateDailyStreak(
        req.user.id,
      );

      sendSuccess(res, streakData, "Daily streak updated");
    } catch (error) {
      next(error);
    }
  }

  // Complete daily task
  async completeDailyTask(req, res, next) {
    try {
      const { taskId } = req.body;

      const result = await gamificationService.completeDailyTask(
        req.user.id,
        taskId,
      );

      sendSuccess(res, result, "Daily task completed");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Complete mission
  async completeMission(req, res, next) {
    try {
      const { missionId } = req.body;

      const result = await gamificationService.completeMission(
        req.user.id,
        missionId,
      );

      sendSuccess(res, result, "Mission completed");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Get leaderboard
  async getLeaderboard(req, res, next) {
    try {
      const limit = req.query.limit || 10;

      const leaderboard = await gamificationService.getLeaderboard(
        parseInt(limit),
      );

      sendSuccess(res, leaderboard, "Leaderboard retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Initialize daily tasks
  async initializeDailyTasks(req, res, next) {
    try {
      const tasks = await gamificationService.initializeDailyTasks(req.user.id);

      sendSuccess(res, tasks, "Daily tasks initialized");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GamificationController();
