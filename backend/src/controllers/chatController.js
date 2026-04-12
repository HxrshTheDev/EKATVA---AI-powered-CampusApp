const chatService = require("../services/chatService");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

class ChatController {
  // Send message
  async sendMessage(req, res, next) {
    try {
      const { conversationId, recipient, content } = req.body;

      const message = await chatService.sendMessage(
        conversationId,
        req.user.id,
        recipient,
        content,
      );

      sendSuccess(res, message, "Message sent", 201);
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Get conversation messages
  async getConversationMessages(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await chatService.getConversationMessages(
        req.params.conversationId,
        page,
        limit,
      );

      sendSuccess(res, result, "Messages retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Mark message as read
  async markAsRead(req, res, next) {
    try {
      const message = await chatService.markMessageAsRead(req.params.messageId);

      sendSuccess(res, message, "Message marked as read");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Get user conversations
  async getUserConversations(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await chatService.getUserConversations(
        req.user.id,
        page,
        limit,
      );

      sendSuccess(res, result, "Conversations retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Delete message
  async deleteMessage(req, res, next) {
    try {
      const result = await chatService.deleteMessage(
        req.params.messageId,
        req.user.id,
      );

      sendSuccess(res, result, "Message deleted");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Get unread count
  async getUnreadCount(req, res, next) {
    try {
      const result = await chatService.getUnreadConversationCount(req.user.id);

      sendSuccess(res, result, "Unread count retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Get or create conversation
  async getOrCreateConversation(req, res, next) {
    try {
      const { otherUserId } = req.body;

      const conversation = await chatService.getOrCreateConversation(
        req.user.id,
        otherUserId,
      );

      sendSuccess(res, conversation, "Conversation retrieved");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatController();
