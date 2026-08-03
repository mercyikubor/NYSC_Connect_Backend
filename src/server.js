import http from "http";
import "dotenv/config";
import app from "./app.js";
import sequelize from "./config/db.js";
import { initializeSocket } from "./sockets/socket.js";

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    console.log("Syncing DB models");
    await sequelize.sync();
    console.log("DB models synced successfully");

    // Socket.IO needs a raw http.Server (not the Express app directly)
    // so REST and WebSocket traffic can share the same port.
    const httpServer = http.createServer(app);
    initializeSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Server is running on: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to initialize:", error);
    process.exit(1);
  }
};

startServer();