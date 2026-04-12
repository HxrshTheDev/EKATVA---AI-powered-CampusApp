const express = require("express");
const eventController = require("../controllers/eventController");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  handleValidationErrors,
} = require("../middleware/validationMiddleware");
const {
  validateCreateEvent,
  validatePagination,
} = require("../utils/validationRules");

const router = express.Router();

// IMPORTANT: Specific routes must come BEFORE parameterized /:eventId routes

// User-specific routes (no param conflict)
router.get("/user/registrations", authenticateToken, eventController.getUserEvents);

// Club routes (no param conflict)
router.get(
  "/clubs/all",
  validatePagination,
  handleValidationErrors,
  eventController.getAllClubs,
);
router.post("/clubs/create", authenticateToken, eventController.createClub);
router.post("/clubs/:clubId/join", authenticateToken, eventController.joinClub);

// Event routes - Public (parameterized come last)
router.get(
  "/",
  validatePagination,
  handleValidationErrors,
  eventController.getAllEvents,
);
router.get("/:eventId", eventController.getEventById);

// Event routes - Protected (parameterized)
router.post(
  "/",
  authenticateToken,
  validateCreateEvent,
  handleValidationErrors,
  eventController.createEvent,
);
router.post("/:eventId/register", authenticateToken, eventController.registerForEvent);
router.delete("/:eventId/unregister", authenticateToken, eventController.unregisterFromEvent);

module.exports = router;
