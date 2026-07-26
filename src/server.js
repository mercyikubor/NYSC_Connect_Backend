import "dotenv/config";
import http from "http";

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

/**
 * Start Application
 */
const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Start Server
    server.listen(PORT, () => {
      console.log("=======================================");
      console.log("NYSC Connect Backend Started");
      console.log(`Environment : ${process.env.NODE_ENV}`);
      console.log(`Server      : http://localhost:${PORT}`);
      console.log(`Health      : http://localhost:${PORT}/health`);
      console.log(`Swagger Docs: http://localhost:${PORT}/api/docs`);
      console.log("=======================================");
    });
  } catch (error) {
    console.error("❌ Unable to start the server");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();

/**
 * Graceful Shutdown
 */
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down server...`);

  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

/**
 * Handle Unhandled Promise Rejections
 */
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Promise Rejection");
  console.error(reason);

  server.close(() => process.exit(1));
});

/**
 * Handle Uncaught Exceptions
 */
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception");
  console.error(error);

  process.exit(1);
});