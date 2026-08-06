import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

<<<<<<< HEAD
import communityRoutes from "./routes/communities.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import groupRoutes from "./routes/groups.routes.js";
import blockRoutes from "./routes/blocks.routes.js";
import announcementRoutes from "./routes/announcements.routes.js";
import postRoutes from "./routes/posts.routes.js";

import notFound from "./middleware/notFound.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
=======
import businessRoutes from "./routes/business-router.js";
import corpRoutes from "./routes/corp-routes.js";
import authRoutes from "./routes/auth-routes.js";
import ocrRoutes from "./routes/ocr-routes.js";
import locationRoutes from "./routes/location-routes.js";
import propertyRoutes from "./routes/property-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import landlordRoutes from "./routes/landlord-routes.js";
import adminAuthRoutes from "./routes/admin-auth-routes.js";
>>>>>>> e472868f082e23583c2049879d930244f02dd7af

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
<<<<<<< HEAD

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
=======
>>>>>>> e472868f082e23583c2049879d930244f02dd7af

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "NYSC Connect Backend API",
    timestamp: new Date(),
  });
});

<<<<<<< HEAD
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
=======
// API Routes
app.use("/api/landlords", landlordRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/corps-member", corpRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `The requested path [${req.method}] ${req.originalUrl} was not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    name: err.name,
    message: err.message,
    field: err.field,
    stack: err.stack,
  });
});
>>>>>>> e472868f082e23583c2049879d930244f02dd7af

export default app;