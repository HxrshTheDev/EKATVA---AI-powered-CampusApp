const express = require("express");
const saarthiController = require("../controllers/saarthiController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Route for generating tests based on syllabus/documents
router.post("/generate-test", authenticateToken, saarthiController.generateTest);

module.exports = router;
