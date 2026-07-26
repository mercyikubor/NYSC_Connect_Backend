import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./config/swagger.js";


// Routes




const app = express();

/**
 * ============================
 * Security Middleware
 * ============================
 */

// Secure HTTP headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// Parse Cookies
app.use(cookieParser());

/**
 * ============================
 * Body Parsers
 * ============================
 */

// Parse JSON
app.use(express.json());

// Parse Form Data
app.use(express.urlencoded({ extended: true }));

/**
 * ============================
 * Logging
 * ============================
 */

app.use(morgan("dev"));

/**
 * ============================
 * Rate Limiting
 * ============================
 */

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(apiLimiter);



app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NYSC Connect API is running",
    timestamp: new Date().toISOString(),
  });
});



app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));






export default app;