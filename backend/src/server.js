require("dotenv").config();
const app = require("./app");
// Removed connectDB
const config = require("./config");

const startServer = async () => {
  try {
    // Database initialization (Supabase is client-side, no 'connect' call needed)
    console.log("✓ Supabase Client Initialized");

    // Start Express server
    const server = app.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║       🚀 EKATVA Backend Server Started       ║
╚══════════════════════════════════════════════╝

📍 Host: http://localhost:${config.port}
📊 Environment: ${config.nodeEnv}
🔐 JWT Secret: ${config.jwt.secret.substring(0, 10)}...
💾 Supabase: ${config.supabase.url}

📚 API Endpoints:
  🔐 Auth: /api/auth
  📊 Dashboard: /api/dashboard
  🎮 Gamification: /api/gamification
  📝 Posts: /api/posts
  💼 Jobs: /api/jobs
  🎪 Events: /api/events
  🛒 Marketplace: /api/marketplace
  💬 Chat: /api/chat

✨ Server ready to receive requests!
      `);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down gracefully...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      process.exit(1);
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
