const express = require("express");
const postController = require("../controllers/postController");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  handleValidationErrors,
} = require("../middleware/validationMiddleware");
const {
  validateCreatePost,
  validatePagination,
} = require("../utils/validationRules");

const router = express.Router();

// Public routes - IMPORTANT: specific routes before parameterized /:postId
router.get(
  "/",
  validatePagination,
  handleValidationErrors,
  postController.getAllPosts,
);
router.get(
  "/user/:userId",
  validatePagination,
  handleValidationErrors,
  postController.getUserPosts,
);
router.get("/:postId", postController.getPostById);

// Protected routes
router.post(
  "/",
  authenticateToken,
  validateCreatePost,
  handleValidationErrors,
  postController.createPost,
);
router.post("/:postId/like", authenticateToken, postController.likePost);
router.post("/:postId/comment", authenticateToken, postController.addComment);
router.delete("/:postId", authenticateToken, postController.deletePost);

module.exports = router;
