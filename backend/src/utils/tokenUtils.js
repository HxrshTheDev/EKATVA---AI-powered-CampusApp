const jwt = require("jsonwebtoken");
const config = require("../config");

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiryTime,
  });
};

// Generate tokens (access token)
const generateTokens = (userId, role) => {
  const accessToken = generateToken(userId, role);
  return { accessToken };
};

module.exports = {
  generateToken,
  generateTokens,
};
