const authService = require("../services/authService");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

class AuthController {
  // Register user
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);

      sendSuccess(res, result, "User registered successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      sendSuccess(res, result, "Login successful");
    } catch (error) {
      sendError(res, error.message, 401);
    }
  }

  // Get user profile
  async getProfile(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id);

      sendSuccess(res, user, "Profile retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user.id, req.body);

      sendSuccess(res, user, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  }

  // Send connection request
  async sendConnectionRequest(req, res, next) {
    try {
      const { toUserId } = req.body;

      const result = await authService.sendConnectionRequest(
        req.user.id,
        toUserId,
      );

      sendSuccess(res, result, "Connection request sent");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Accept connection request
  async acceptConnectionRequest(req, res, next) {
    try {
      const { fromUserId } = req.body;

      const result = await authService.acceptConnectionRequest(
        req.user.id,
        fromUserId,
      );

      sendSuccess(res, result, "Connection request accepted");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }
}

module.exports = new AuthController();
