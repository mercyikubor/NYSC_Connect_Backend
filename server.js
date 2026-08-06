import http from "http";
import app from "./src/app.js";
import sequelize from "./src/config/db.js";
import "dotenv/config";
import { initializeSocket } from "./src/sockets/socket.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    console.log("Syncing DB models...");

    await sequelize.sync();

    console.log("DB models synced successfully");

    console.log("Starting Express server...");

    const httpServer = http.createServer(app);
    initializeSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Server is running on: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to initialize:");
    console.error(error);
    process.exit(1);
  }
};

startServer();
