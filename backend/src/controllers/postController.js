const postService = require("../services/postService");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

class PostController {
  // Create post
  async createPost(req, res, next) {
    try {
      const post = await postService.createPost(req.user.id, req.body);

      sendSuccess(res, post, "Post created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  // Get all posts
  async getAllPosts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await postService.getAllPosts(page, limit);

      sendSuccess(res, result, "Posts retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Get post by ID
  async getPostById(req, res, next) {
    try {
      const post = await postService.getPostById(req.params.postId);

      sendSuccess(res, post, "Post retrieved");
    } catch (error) {
      sendError(res, error.message, 404);
    }
  }

  // Like post
  async likePost(req, res, next) {
    try {
      const result = await postService.likePost(req.params.postId, req.user.id);

      sendSuccess(res, result, "Post liked/unliked");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Add comment
  async addComment(req, res, next) {
    try {
      const { text } = req.body;

      const comment = await postService.addComment(
        req.params.postId,
        req.user.id,
        text,
      );

      sendSuccess(res, comment, "Comment added", 201);
    } catch (error) {
      next(error);
    }
  }

  // Delete post
  async deletePost(req, res, next) {
    try {
      const result = await postService.deletePost(
        req.params.postId,
        req.user.id,
      );

      sendSuccess(res, result, "Post deleted");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Get user posts
  async getUserPosts(req, res, next) {
    try {
      const userId = req.params.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await postService.getUserPosts(userId, page, limit);

      sendSuccess(res, result, "User posts retrieved");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
