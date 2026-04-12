const digitalTwinService = require("../services/digitalTwinService");
const gamificationService = require("../services/gamificationService");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

class DashboardController {
  // Get dashboard data
  async getDashboard(req, res, next) {
    try {
      const dashboardData = await digitalTwinService.getDashboardData(
        req.user.id,
      );
      const gamification = await gamificationService.getGamification(
        req.user.id,
      );

      const response = {
        ...dashboardData,
        level: gamification.level,
        xp: gamification.totalXP,
        streak: gamification.dailyStreak,
      };

      sendSuccess(res, response, "Dashboard data retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Get AI insights
  async getInsights(req, res, next) {
    try {
      const insights = await digitalTwinService.generateInsights(req.user.id);

      sendSuccess(res, insights, "Insights generated");
    } catch (error) {
      next(error);
    }
  }

  // Get digital twin
  async getDigitalTwin(req, res, next) {
    try {
      const digitalTwin = await digitalTwinService.getDigitalTwin(req.user.id);

      sendSuccess(res, digitalTwin, "Digital twin retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Update attendance
  async updateAttendance(req, res, next) {
    try {
      const attendance = await digitalTwinService.updateAttendance(
        req.user.id,
        req.body,
      );

      sendSuccess(res, attendance, "Attendance updated");
    } catch (error) {
      next(error);
    }
  }

  // Update study hours
  async updateStudyHours(req, res, next) {
    try {
      const { hours } = req.body;

      if (!hours || hours <= 0) {
        return sendError(res, "Hours must be greater than 0", 400);
      }

      const studyHours = await digitalTwinService.updateStudyHours(
        req.user.id,
        hours,
      );

      // Award XP for studying
      await gamificationService.awardXP(
        req.user.id,
        Math.floor(hours * 10),
        "study-session",
      );

      sendSuccess(res, studyHours, "Study hours updated and XP awarded");
    } catch (error) {
      next(error);
    }
  }

  // Log activity
  async logActivity(req, res, next) {
    try {
      const { activity, xpAmount } = req.body;

      const result = await digitalTwinService.logActivity(
        req.user.id,
        activity,
        xpAmount || 10,
      );

      sendSuccess(res, result, "Activity logged");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
