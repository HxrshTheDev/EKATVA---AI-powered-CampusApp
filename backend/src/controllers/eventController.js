const eventService = require("../services/eventService");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

class EventController {
  // Create event
  async createEvent(req, res, next) {
    try {
      const event = await eventService.createEvent(req.body, req.user.id);

      sendSuccess(res, event, "Event created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  // Get all events
  async getAllEvents(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await eventService.getAllEvents(page, limit);

      sendSuccess(res, result, "Events retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Get event by ID
  async getEventById(req, res, next) {
    try {
      const event = await eventService.getEventById(req.params.eventId);

      sendSuccess(res, event, "Event retrieved");
    } catch (error) {
      sendError(res, error.message, 404);
    }
  }

  // Register for event
  async registerForEvent(req, res, next) {
    try {
      const result = await eventService.registerForEvent(
        req.params.eventId,
        req.user.id,
      );

      sendSuccess(res, result, "Registered for event");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Unregister from event
  async unregisterFromEvent(req, res, next) {
    try {
      const result = await eventService.unregisterFromEvent(
        req.params.eventId,
        req.user.id,
      );

      sendSuccess(res, result, "Unregistered from event");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Get user events
  async getUserEvents(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await eventService.getUserRegisteredEvents(
        req.user.id,
        page,
        limit,
      );

      sendSuccess(res, result, "User events retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Create club
  async createClub(req, res, next) {
    try {
      const club = await eventService.createClub(req.body, req.user.id);

      sendSuccess(res, club, "Club created", 201);
    } catch (error) {
      next(error);
    }
  }

  // Get all clubs
  async getAllClubs(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await eventService.getAllClubs(page, limit);

      sendSuccess(res, result, "Clubs retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Join club
  async joinClub(req, res, next) {
    try {
      const result = await eventService.joinClub(
        req.params.clubId,
        req.user.id,
      );

      sendSuccess(res, result, "Joined club");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }
}

module.exports = new EventController();
