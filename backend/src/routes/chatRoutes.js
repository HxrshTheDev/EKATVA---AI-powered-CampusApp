const express = require("express");
const chatController = require("../controllers/chatController");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  handleValidationErrors,
} = require("../middleware/validationMiddleware");
const { validatePagination } = require("../utils/validationRules");

const router = express.Router();

// Protected routes
router.post("/message", authenticateToken, chatController.sendMessage);
router.get(
  "/conversation/:conversationId",
  authenticateToken,
  validatePagination,
  handleValidationErrors,
  chatController.getConversationMessages,
);
router.put(
  "/message/:messageId/read",
  authenticateToken,
  chatController.markAsRead,
);
router.delete(
  "/message/:messageId",
  authenticateToken,
  chatController.deleteMessage,
);

// Conversation routes
router.get(
  "/conversations",
  authenticateToken,
  validatePagination,
  handleValidationErrors,
  chatController.getUserConversations,
);
router.post(
  "/conversation",
  authenticateToken,
  chatController.getOrCreateConversation,
);
router.get("/unread/count", authenticateToken, chatController.getUnreadCount);

module.exports = router;
