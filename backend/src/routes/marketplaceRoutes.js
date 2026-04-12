const express = require("express");
const marketplaceController = require("../controllers/marketplaceController");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  handleValidationErrors,
} = require("../middleware/validationMiddleware");
const {
  validateCreateMarketplaceItem,
  validatePagination,
} = require("../utils/validationRules");

const router = express.Router();

// IMPORTANT: Specific named routes must come BEFORE parameterized /:itemId

// Seller routes - must come before /:itemId
router.get(
  "/seller/items",
  authenticateToken,
  validatePagination,
  handleValidationErrors,
  marketplaceController.getSellerItems,
);

// Buyer routes - must come before /:itemId
router.get(
  "/buyer/purchases",
  authenticateToken,
  validatePagination,
  handleValidationErrors,
  marketplaceController.getBuyerPurchases,
);

// Public routes
router.get(
  "/",
  validatePagination,
  handleValidationErrors,
  marketplaceController.getAllItems,
);
router.get("/:itemId", marketplaceController.getItemById);

// Protected routes
router.post(
  "/",
  authenticateToken,
  validateCreateMarketplaceItem,
  handleValidationErrors,
  marketplaceController.createItem,
);
router.post("/:itemId/like", authenticateToken, marketplaceController.likeItem);
router.post(
  "/:itemId/inquiry",
  authenticateToken,
  marketplaceController.sendInquiry,
);
router.put(
  "/:itemId/sold",
  authenticateToken,
  marketplaceController.markAsSold,
);

module.exports = router;
