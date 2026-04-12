const jwt = require("jsonwebtoken");
const config = require("../config");

// Verify JWT token
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    jwt.verify(token, config.jwt.secret, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Token expired or invalid",
        });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    });
  }
};

// Check if user has required role
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions for this action",
      });
    }

    next();
  };
};

// Verify if user is the owner of the resource or admin
const authorizeOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const resourceOwnerId = req.params.userId || req.body.userId;

  if (req.user.id !== resourceOwnerId && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to access this resource",
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  authorizeRole,
  authorizeOwnerOrAdmin,
};
