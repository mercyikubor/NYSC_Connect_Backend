import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import businessRoutes from "./routes/business-router.js";
import corpRoutes from "./routes/corp-routes.js";
import authRoutes from "./routes/auth-routes.js";
import ocrRoutes from "./routes/ocr-routes.js";
import locationRoutes from "./routes/location-routes.js";
import propertyRoutes from "./routes/property-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import landlordRoutes from "./routes/landlord-routes.js";
import adminAuthRoutes from "./routes/admin-auth-routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "NYSC Connect Backend API",
    timestamp: new Date(),
  });
});

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

export default app;