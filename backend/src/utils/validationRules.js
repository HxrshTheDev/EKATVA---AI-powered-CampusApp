const { body, param, query } = require("express-validator");

// Auth Validations
const validateRegister = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("college").trim().notEmpty().withMessage("College is required"),
  body("course")
    .isIn(["B.Tech", "M.Tech", "BCA", "MCA", "B.Sc", "M.Sc", "MBA", "Other"])
    .withMessage("Invalid course"),
  body("year").isIn([1, 2, 3, 4]).withMessage("Year must be between 1-4"),
  body("rollNumber").trim().notEmpty().withMessage("Roll number is required"),
];

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Post Validations
const validateCreatePost = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Post content is required")
    .isLength({ max: 5000 })
    .withMessage("Content cannot exceed 5000 characters"),
  body("visibility")
    .isIn(["public", "friends", "private"])
    .withMessage("Invalid visibility setting"),
];

// Job Validations
const validateCreateJob = [
  body("title").trim().notEmpty().withMessage("Job title is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required"),
  body("company").trim().notEmpty().withMessage("Company name is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("jobType")
    .isIn(["full-time", "part-time", "internship", "contract", "freelance"])
    .withMessage("Invalid job type"),
  body("deadline").isISO8601().withMessage("Invalid date format"),
];

// Event Validations
const validateCreateEvent = [
  body("title").trim().notEmpty().withMessage("Event title is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Event description is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("startDate").isISO8601().withMessage("Invalid start date"),
  body("eventType")
    .isIn([
      "workshop",
      "seminar",
      "hackathon",
      "competition",
      "meetup",
      "conference",
      "club-activity",
      "other",
    ])
    .withMessage("Invalid event type"),
];

// Marketplace Validations
const validateCreateMarketplaceItem = [
  body("title").trim().notEmpty().withMessage("Item title is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Item description is required"),
  body("category")
    .isIn([
      "books",
      "notes",
      "electronics",
      "furniture",
      "clothing",
      "sports",
      "accessories",
      "other",
    ])
    .withMessage("Invalid category"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("condition")
    .isIn(["new", "like-new", "good", "fair"])
    .withMessage("Invalid condition"),
];

// ID Validation
const validateObjectId = [
  param("id")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid ID format"),
];

// Pagination Validation
const validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be > 0"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1-100"),
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreatePost,
  validateCreateJob,
  validateCreateEvent,
  validateCreateMarketplaceItem,
  validateObjectId,
  validatePagination,
};
