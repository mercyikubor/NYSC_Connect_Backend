import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import communityRoutes from "./routes/communities.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import groupRoutes from "./routes/groups.routes.js";
import blockRoutes from "./routes/blocks.routes.js";
import announcementRoutes from "./routes/announcements.routes.js";
import postRoutes from "./routes/posts.routes.js";

import notFound from "./middleware/notFound.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "NYSC Connect Backend API",
    timestamp: new Date(),
  });
});

// Community routes
app.use("/api/communities", communityRoutes);

// Message routes
app.use("/api/messages", messageRoutes);

// Group routes
app.use("/api/groups", groupRoutes);

// Block routes
app.use("/api/blocks", blockRoutes);

// Announcement routes
app.use("/api/announcements", announcementRoutes);

// Post & Comment routes
app.use("/api/posts", postRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorMiddleware);

export default app;