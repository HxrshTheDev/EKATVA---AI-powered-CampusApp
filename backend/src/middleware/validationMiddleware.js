const { validationResult } = require("express-validator");

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors.array().map((error) => ({
        field: error.path || error.param, // express-validator v7 uses .path
        message: error.msg,
      })),
    });
  }

  next();
};

module.exports = {
  handleValidationErrors,
};
