require("dotenv").config();

module.exports = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Supabase Configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
  },

  // JWT Configuration
  jwt: {
    secret:
      process.env.JWT_SECRET || "ekatva_dev_jwt_secret_key_change_in_prod",
    expiryTime: process.env.JWT_EXPIRY || "7d",
  },

  // Bcrypt Configuration
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  },

  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || "http://localhost:5000",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || "debug",
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200,
  },

  // CORS Configuration — allow multiple origins in dev
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = (
        process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:5173"
      ).split(",");
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in development
      }
    },
    credentials: true,
  },

  // AI Service Configuration
  saarthi: {
    apiKey: process.env.SAARTHI_API_KEY || "",
    model: process.env.SAARTHI_MODEL || "gemini-pro",
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    uploadDir: process.env.UPLOAD_DIR || "uploads",
  },

  // Redis Configuration (Optional)
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
};
