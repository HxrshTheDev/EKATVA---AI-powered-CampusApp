const marketplaceService = require("../services/marketplaceService");
const { sendSuccess, sendError } = require("../utils/responseFormatter");

class MarketplaceController {
  // Create item
  async createItem(req, res, next) {
    try {
      const item = await marketplaceService.createItem(req.body, req.user.id);

      sendSuccess(res, item, "Item listed successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  // Get all items
  async getAllItems(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filters = {
        category: req.query.category,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        condition: req.query.condition,
        search: req.query.search,
      };

      const result = await marketplaceService.getAllItems(page, limit, filters);

      sendSuccess(res, result, "Items retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Get item by ID
  async getItemById(req, res, next) {
    try {
      const item = await marketplaceService.getItemById(req.params.itemId);

      sendSuccess(res, item, "Item retrieved");
    } catch (error) {
      sendError(res, error.message, 404);
    }
  }

  // Like item
  async likeItem(req, res, next) {
    try {
      const result = await marketplaceService.likeItem(
        req.params.itemId,
        req.user.id,
      );

      sendSuccess(res, result, "Item liked/unliked");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Send inquiry
  async sendInquiry(req, res, next) {
    try {
      const { message } = req.body;

      const result = await marketplaceService.sendInquiry(
        req.params.itemId,
        req.user.id,
        message,
      );

      sendSuccess(res, result, "Inquiry sent");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Mark as sold
  async markAsSold(req, res, next) {
    try {
      const { buyerId } = req.body;

      const result = await marketplaceService.markAsSold(
        req.params.itemId,
        req.user.id,
        buyerId,
      );

      sendSuccess(res, result, "Item marked as sold");
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  // Get seller items
  async getSellerItems(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await marketplaceService.getSellerItems(
        req.user.id,
        page,
        limit,
      );

      sendSuccess(res, result, "Seller items retrieved");
    } catch (error) {
      next(error);
    }
  }

  // Get buyer purchases
  async getBuyerPurchases(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await marketplaceService.getBuyerPurchases(
        req.user.id,
        page,
        limit,
      );

      sendSuccess(res, result, "Purchases retrieved");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MarketplaceController();
